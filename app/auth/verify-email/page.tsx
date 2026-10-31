'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(countdown - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-soft">
          <div className="w-20 h-20 bg-gradient-to-br from-boost-blue to-boost-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground mb-6">
            Please verify your email address to continue. Check your inbox and enter the verification code below.
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6].map((digit) => (
              <input
                key={digit}
                id={`code-${digit}`}
                type="text"
                maxLength={1}
                className="w-10 h-12 text-center text-lg font-semibold rounded-xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const next = document.getElementById(`code-${digit + 1}`);
                    if (next) (next as HTMLElement).focus();
                  }
                }}
              />
            ))}
          </div>

          <Link
            href="/habits"
            className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all mb-4"
          >
            Verify Account
          </Link>

          <p className="text-sm text-muted-foreground mb-4">
            Didn't receive the code?{' '}
            {canResend ? (
              <button onClick={handleResend} className="text-primary hover:text-primary/80 font-medium">
                Resend code
              </button>
            ) : (
              <span>Resend in {countdown}s</span>
            )}
          </p>

          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
