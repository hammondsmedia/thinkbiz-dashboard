import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Initialize the Supabase Admin Client
// We use the Service Role Key here to bypass Row Level Security 
// so the webhook has permission to update any user's row.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    // 2. Open the package from Outseta
    const body = await request.json();
    
    // Outseta sends property names capitalized. 
    // We need their unique ID (Uid) and their Email.
    const outsetaUserId = body.Uid;
    const email = body.Email?.toLowerCase().trim();

    // If Outseta sent a ping without an email or ID, ignore it safely.
    if (!outsetaUserId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Attempting to link Outseta ID for: ${email}`);

    // 3. Find the matching email in Supabase and update the Outseta ID
    const { data, error } = await supabaseAdmin
      .from('members')
      .update({ outseta_user_id: outsetaUserId })
      .eq('email', email)
      .select();

    if (error) {
      console.error("Supabase Database Error:", error);
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    // 4. Handle the "Email Not Found" scenario
    if (data.length === 0) {
      console.log(`Notice: No historical data found for email ${email}. A new empty profile will be needed.`);
      // We still return a 200 Success status to Outseta. 
      // If we return an error, Outseta will assume the message failed to deliver and will keep spamming the webhook for 3 days trying to fix it.
      return NextResponse.json({ message: 'Webhook received, but email not in historical database' }, { status: 200 });
    }

    console.log(`Success! Linked ${email} to Outseta ID: ${outsetaUserId}`);
    return NextResponse.json({ message: 'Successfully linked user' }, { status: 200 });
    
  } catch (error) {
    console.error("Webhook Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}