import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Open the package from Outseta
    const body = await request.json();
    
    // We will add the Supabase matching logic right here in the next step
    console.log("Outseta sent us a new signup:", body);

    // 2. Tell Outseta we received it successfully
    return NextResponse.json({ message: 'Webhook received and processed' }, { status: 200 });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}