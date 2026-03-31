import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as jose from 'jose';
import { createClient } from '@supabase/supabase-js';

import { Navbar } from "@/components/navbar";
import { Scorecards } from "@/components/scorecards";
import { DashboardCharts } from "@/components/dashboard-charts";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('outseta_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let member;
  let logs: any[] = [];
  let revenue: { revenue_amount: number}[] = [];
  let denyAccess = false;

  try {
    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://${process.env.NEXT_PUBLIC_OUTSETA_DOMAIN}/.well-known/jwks`)
    );
    
    // Added clockTolerance to prevent crashes from minor server time differences
    const { payload } = await jose.jwtVerify(token, JWKS, {
      clockTolerance: '15 seconds'
    });
    
    const outsetaUserId = payload.sub; 
    const email = payload.email ? payload.email.toString().toLowerCase().trim() : null;

    // --- DIAGNOSTICS: Check your terminal for these! ---
    console.log("\n--- AUTH DEBUG ---");
    console.log("JWT Payload sub (Outseta ID):", outsetaUserId);
    console.log("JWT Payload email:", email);

    // 1. Admin Client: Used ONLY for syncing the profile on the first login
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    let { data: memberData, error: memberError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('outseta_user_id', outsetaUserId)
      .maybeSingle(); 

    // 2. Safer Sync Logic
    if (!memberData && email) {
      console.log(`Outseta ID ${outsetaUserId} not found. Searching for email: ${email}`);
      
      const { data: emailCheck } = await supabaseAdmin
        .from('members')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (emailCheck) {
        console.log("Email match found! Updating database with new Outseta ID...");
        const { data: updatedMember, error: updateError } = await supabaseAdmin
          .from('members')
          .update({ outseta_user_id: outsetaUserId })
          .eq('email', email)
          .select()
          .single();

        if (updateError) {
          console.error("Failed to sync new user ID:", updateError);
          throw updateError;
        }
        memberData = updatedMember;
      } else {
        console.log("Email not found in the members table.");
      }
    }

    if (!memberData) {
      console.log("Result: Access Denied. No matching member record found.");
      denyAccess = true;
    } else {
      console.log(`Result: Success. Welcome, ${memberData.first_name}.`);
      member = memberData;

      // 3. Security Fix: Create a user-specific JWT for Supabase
      const supabaseEncodedJwtSecret = new TextEncoder().encode(
        process.env.SUPABASE_JWT_SECRET!
      );

      const supabaseJwt = await new jose.SignJWT({
        ...payload,
        sub: member.id, 
        role: 'authenticated'
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer("supabase")
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(supabaseEncodedJwtSecret);

      // 4. Secure Client: Used to fetch the user's private data
      const supabaseSecure = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${supabaseJwt}`,
            },
          },
        }
      );

      const logsPromise = supabaseSecure
        .from('weekly_logs')
        .select('*')
        .eq('member_id', member.id);

      //const revenuePromise = supabaseSecure
      //  .from('closed_business_thanks')
      //  .select('revenue_amount')
      //  .eq('thanked_member_id', member.id);

      const revenuePromise = supabaseAdmin
        .from('closed_business_thanks')
        .select('revenue_amount')
        .eq('thanking_member_id', member.id);
      
      const [{ data: logsData }, { data: revenueData, error: revenueError }] = await Promise.all([
        logsPromise,
        revenuePromise
      ]);
        
      console.log('\n--- REVENUE DEBUG ---');
      console.log('Raw revenueData:', revenueData);
      console.log('Revenue query error:', revenueError);

      logs = logsData || [];
      revenue = revenueData || [];
    }

  } catch (error) {
    console.error("\n=== FATAL AUTH/DB ERROR ===");
    console.error(error);
    console.error("===========================\n");
    denyAccess = true;
  }

  if (denyAccess) {
    redirect('/access-denied');
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {member ? `Welcome back, ${member.first_name}` : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your ThinkBiz performance at a glance.
          </p>
        </div>

        <section aria-label="Key metrics" className="mb-8">
          <Scorecards logsData={logs} revenueData={revenue} />
        </section>

        <section aria-label="Monthly trends">
          <DashboardCharts data={logs} />
        </section>
      </main>
    </div>
  );
}