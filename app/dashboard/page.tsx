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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // Try to find the user by their Outseta ID first
    let { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('outseta_user_id', outsetaUserId)
      .maybeSingle(); 

    // If they aren't found by ID, this is their first time logging in. 
    // Let's find them by email and sync the account.
    if (!memberData && email) {
      const { data: updatedMember, error: updateError } = await supabase
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

    // If we STILL don't have a member, they aren't in the historical spreadsheet at all
    if (!memberData) {
      redirect('/access-denied');
    }

    member = memberData;

    // Get their weekly logs
    const { data: logsData } = await supabase
      .from('weekly_logs')
      .select('*')
      .eq('member_id', member?.id);
      
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