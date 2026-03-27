import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as jose from 'jose';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// You will need to add your Outseta domain to your environment variables
const outsetaDomain = process.env.NEXT_PUBLIC_OUTSETA_DOMAIN!; 

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
    }

    // 1. Fetch Outseta's official "key ring" to verify the badge is real
    const JWKS = jose.createRemoteJWKSet(new URL(`https://${outsetaDomain}/api/v1/keys`));

    // 2. Verify and read the badge
    const { payload } = await jose.jwtVerify(accessToken, JWKS);
    
    // Outseta stores the user's unique ID in the "sub" (subject) field
    const outsetaUserId = payload.sub;
    const email = payload.email?.toString().toLowerCase().trim();

    if (!outsetaUserId || !email) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    // 3. Update Supabase with the new ID
    const { data, error } = await supabaseAdmin
      .from('members')
      .update({ outseta_user_id: outsetaUserId })
      .eq('email', email)
      .select();

    if (error) {
      console.error("Database sync error:", error);
      return NextResponse.json({ error: 'Failed to sync database' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile synced successfully', user: data[0] }, { status: 200 });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}