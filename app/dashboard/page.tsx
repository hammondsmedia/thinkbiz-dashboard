import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as jose from 'jose';
import { createClient } from '@supabase/supabase-js';

import { Navbar } from "@/components/navbar";
import { Scorecards } from "@/components/scorecards";
import { DashboardCharts } from "@/components/dashboard-charts";

export default async function DashboardPage() {
  // 1. Authenticate the user via the Outseta cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('outseta_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let member;
  let logs;

  try {
    // 2. Verify the token
    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://${process.env.NEXT_PUBLIC_OUTSETA_DOMAIN}/.well-known/jwks`)
    );
    const { payload } = await jose.jwtVerify(token, JWKS);
    const outsetaUserId = payload.sub; 

    // 3. Fetch data securely with the Service Role Key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // Get member details
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('outseta_user_id', outsetaUserId)
      .single();

    if (memberError) throw memberError;
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

  // 4. Render the UI
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {/* Personalize the greeting if we found their name */}
            {member ? `Welcome back, ${member.first_name}` : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your ThinkBiz performance at a glance.
          </p>
        </div>

        <section aria-label="Key metrics" className="mb-8">
          {/* Passing the logs down to the component to calculate totals */}
          <Scorecards data={logs} />
        </section>

        <section aria-label="Monthly trends">
          {/* Passing the logs down to render the charts */}
          <DashboardCharts data={logs} />
        </section>
      </main>
    </div>
  );
}
