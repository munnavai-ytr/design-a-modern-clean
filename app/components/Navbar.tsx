'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, Menu, X, Flame, Coins } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/habits', label: 'Habits' },
    { href: '/rewards', label: 'Rewards' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-boost-blue to-boost-purple rounded-2xl flex items-center justify-center shadow-soft">
                <span className="text-white text-sm font-bold">DB</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight hidden sm:block">
                DailyBoost
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>
              {session ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-soft">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{session.user?.streak || 0}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-soft">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{session.user?.credits || 0}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium shadow-soft"
                  >
                    {session.user?.name?.[0] || 'U'}
                  </Link>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-xl hover:bg-secondary text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden border-t border-border bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden',
            isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
          )}
        >
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
