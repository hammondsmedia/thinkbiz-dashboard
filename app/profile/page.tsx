import { Navbar } from "@/components/navbar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-4">
        <div data-o-profile="1" data-mode="embed"></div>
      </main>
    </div>
  );
}