export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-soft">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-destructive">!</span>
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">
            Something went wrong during authentication. Please try again.
          </p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow transition-all"
          >
            Try Again
          </a>
        </div>
      </div>
    </div>
  );
}
