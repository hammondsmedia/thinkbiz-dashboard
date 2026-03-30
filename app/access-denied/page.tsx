import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Access Denied</h1>
        
        <p className="text-muted-foreground">
          You successfully logged in, but we couldn't locate your email address in the ThinkBiz historical database. 
        </p>
        
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please ensure you signed up with the exact email address associated with your ThinkBiz membership.
        </p>

        <div className="pt-4">
          <Link 
            href="/login" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Another Account
          </Link>
        </div>
      </div>
    </main>
  );
}