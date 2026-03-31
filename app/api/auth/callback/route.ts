import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('access_token');

  // If there is no token, someone navigated here by accident. Bounce them to login.
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Securely lock the token in an HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set('outseta_token', token, {
    path: '/',
    maxAge: 86400, // 24 hours
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Security upgrade: blocks client-side JS from reading the token
  });

  // Cleanly route the user to the protected dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}