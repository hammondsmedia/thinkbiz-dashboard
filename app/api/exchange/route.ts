import * as jose from 'jose';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Get the Outseta signed JWT from the request headers
  const authHeader = req.headers.get("Authorization");
  const outsetaJwtAccessToken = authHeader?.split(" ")[1] || "";

  if (!outsetaJwtAccessToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // 2. Fetch your Outseta Public Key to verify the token is real
    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://${process.env.NEXT_PUBLIC_OUTSETA_DOMAIN}/.well-known/jwks`)
    );

    const { payload } = await jose.jwtVerify(outsetaJwtAccessToken, JWKS);

    // 3. Update the JWT payload for Supabase
    payload.role = "authenticated"; // This is required by Supabase RLS

    const supabaseEncodedJwtSecret = new TextEncoder().encode(
      process.env.SUPABASE_JWT_SECRET
    );

    // 4. Sign the new token with your Supabase secret
    const supabaseJwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer("supabase")
      .setIssuedAt(payload.iat)
      .setExpirationTime(payload.exp || "")
      .sign(supabaseEncodedJwtSecret);

    // 5. Send the Supabase token back to the frontend
    return NextResponse.json({ supabaseJwt }, { status: 200 });

  } catch (error) {
    console.error("Token exchange failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}