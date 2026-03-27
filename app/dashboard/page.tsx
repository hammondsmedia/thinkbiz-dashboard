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
  let logs;

  try {
    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://${process.env.NEXT_PUBLIC_OUTSETA_DOMAIN}/.well-known/jwks`)
    );
    const { payload } = await jose.jwtVerify(token, JWKS);
    
    const outsetaUserId = payload.sub; 
    const email = payload.email?.toString().toLowerCase().trim();

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

    if (!memberData && email) {
      const { data: updatedMember, error: updateError } = await supabaseAdmin
        .from('members')
        .update({ outseta_user_id: outsetaUserId })
        .eq('email', email)
        .select()
        .single();

      if (updateError) {
        console.error("Failed to sync new user:", updateError);
        throw updateError;
      }
      memberData = updatedMember;
    }

    if (!memberData) {
      redirect('/access-denied');
    }

    member = memberData;

    // 2. Security Fix: Create a user-specific JWT for Supabase
    // We set the 'sub' to the member's database ID so Row Level Security knows exactly who they are.
    const supabaseEncodedJwtSecret = new TextEncoder().encode(
      process.env.SUPABASE_JWT_SECRET
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

    // 3. Secure Client: Used to fetch the user's private data
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

    const { data: logsData } = await supabaseSecure
      .from('weekly_logs')
      .select('*')
      .eq('member_id', member.id);
      
    logs = logsData || [];

  } catch (error) {
    console.error("Auth or Database Error:", error);
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
          <Scorecards data={logs} />
        </section>

        <section aria-label="Monthly trends">
          <DashboardCharts data={logs} />
        </section>
      </main>
    </div>
  );
}