import { BarChart3 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-foreground">
            <BarChart3 className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="text-xl font-semibold tracking-tight">
              ThinkBiz Solutions
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="mb-6 text-center text-xl font-bold text-card-foreground">
            Member Login
          </h1>

          <div className="flex min-h-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-6">
            <p className="text-center text-sm text-muted-foreground">
              Outseta Login Widget Loads Here
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help?{" "}
          <a href="/support" className="font-medium text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
