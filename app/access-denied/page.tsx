import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" aria-hidden="true" />
        </div>

        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
          Access Denied
        </h1>

        <p className="mb-8 text-muted-foreground">
          You need an active ThinkBiz membership to view this page.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
