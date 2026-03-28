// Dashboard Layout

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThinkBiz Solutions - Dashboard",
  description: "Professional networking group dashboard for ThinkBiz Solutions members.",
};

export const viewport: Viewport = {
  themeColor: "#1a73e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <Script 
          id="outseta-options" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.o_options = {
                domain: '${process.env.NEXT_PUBLIC_OUTSETA_DOMAIN}',
                load: 'auth,customForm,emailList,leadCapture,nocode,profile,support',
                auth: {
                  redirectUrl: '/dashboard'
                }
              };
            `
          }}
        />
        <Script 
          src="https://cdn.outseta.com/outseta.min.js" 
          strategy="afterInteractive" 
        />
        {children}
      </body>
    </html>
  );
}