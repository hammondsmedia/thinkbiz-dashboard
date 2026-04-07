import { cookies } from "next/headers";
import { Navbar } from "@/components/navbar";
import { OutsetaProfile } from "@/components/outseta-profile";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("outseta_token")?.value;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-4">
        <OutsetaProfile accessToken={token} />
      </main>
    </div>
  );
}