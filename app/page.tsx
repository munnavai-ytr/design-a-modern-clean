import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Sun, Moon, Bell, Flame, CreditCard, CreditCard as CreditIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-boost-blue to-boost-purple rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-white text-sm font-bold">DB</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">DailyBoost</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            {session ? (
              <Link href="/profile" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium shadow-soft">
                {session.user?.name?.[0] || 'U'}
              </Link>
            ) : (
              <Link href="/auth/login" className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                Hello, {session?.user?.name || 'User'} 👋
              </h1>
              <p className="text-muted-foreground">
                Keep your streak alive today!
              </p>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-3xl p-3 sm:p-4 shadow-soft">
              <div className="flex items-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">{session?.user?.streak || 0} days</span>
              </div>
              <span className="text-sm text-muted-foreground">streak</span>
              <div className="w-px h-4 bg-border mx-2" />
              <div className="flex items-center gap-1">
                <CreditIcon className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{session?.user?.credits || 0}</span>
              </div>
              <span className="text-sm text-muted-foreground">credits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Today's Habits */}
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-soft animate-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Today's Habits</h2>
                <Link href="/habits" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">💧</span>
                    </div>
                    <span className="text-sm font-medium">Drink Water</span>
                  </div>
                  <button className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center hover:scale-105 transition-transform">
                    ✓
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">🏃</span>
                    </div>
                    <span className="text-sm font-medium">Morning Walk</span>
                  </div>
                  <button className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center hover:scale-105 transition-transform">
                    ✓
                  </button>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-soft animate-in" style="animation-delay: 100ms">
              <h2 className="font-semibold text-lg mb-4">Daily Progress</h2>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-boost-blue to-boost-purple h-full rounded-full w-2/3 transition-all duration-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>2 / 3 habits</div>
                <div>Today</div>
                <div>On track</div>
              </div>
            </div>

            {/* Daily Reward */}
            <div className="bg-gradient-to-br from-boost-blue to-boost-purple rounded-3xl p-4 sm:p-6 shadow-glow animate-in" style="animation-delay: 200ms">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg text-white">Daily Reward</h2>
                <span className="text-xs text-purple-100 bg-purple-500/20 px-2 py-1 rounded-full">+5 credits</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/20 border border-white/30">
                <div>
                  <p className="text-xs text-purple-200">Watch ad to earn</p>
                  <p className="text-white font-semibold">5 credits</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-white text-boost-blue text-sm font-semibold hover:bg-purple-100 transition-colors">
                  Watch Ad
                </button>
              </div>
              <p className="text-xs text-purple-200 mt-2 text-center">3 ads remaining today</p>
            </div>
          </div>

          {/* Quick Add Habit */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">Quick Add Habit</h2>
                <p className="text-sm text-muted-foreground">Start a new habit today</p>
              </div>
              <button className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow transition-all flex items-center gap-2">
                <span>+</span> Add Habit
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
