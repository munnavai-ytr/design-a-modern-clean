'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { Navbar } from '@/app/components/Navbar';
import { CREDIT_RULES, USAGE_COSTS } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { CreditCard, Film, Shield, Palette, Plus, Download, Flame, Clock, Check, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function RewardsPage() {
  const { data: session } = useSession();
  const { user, updateCredits } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [adsWatched, setAdsWatched] = useState(0);
  const [lastAdDate, setLastAdDate] = useState<string | null>(null);

  // Check if we can show ads today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = localStorage.getItem('dailyboost-ads');
    if (stored) {
      const { count, date } = JSON.parse(stored);
      if (date === today) {
        setAdsWatched(count);
      } else {
        setAdsWatched(0);
        localStorage.removeItem('dailyboost-ads');
      }
    }
  }, [today]);

  const canWatchMoreAds = adsWatched < CREDIT_RULES.MAX_ADS_PER_DAY;
  const remainingAds = CREDIT_RULES.MAX_ADS_PER_DAY - adsWatched;
  const maxCreditsFromAds = CREDIT_RULES.MAX_ADS_PER_DAY * CREDIT_RULES.AD_REWARD;

  const { mutate: watchAd } = useMutation({
    mutationFn: async () => {
      // Simulate ad watching
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newCount = adsWatched + 1;
      setAdsWatched(newCount);
      localStorage.setItem('dailyboost-ads', JSON.stringify({ count: newCount, date: today }));

      // Add credits
      updateCredits(CREDIT_RULES.AD_REWARD);

      // Record transaction in DB
      await db.creditTransaction.create({
        data: {
          userId: user!.id,
          amount: CREDIT_RULES.AD_REWARD,
          type: 'ad_reward',
          source: 'rewarded_ad',
          description: `Rewarded ad watched (${newCount}/${CREDIT_RULES.MAX_ADS_PER_DAY})`,
        },
      });

      addNotification({
        type: 'success',
        message: `Ad watched! +${CREDIT_RULES.AD_REWARD} credits`,
      });
    },
  });

  const { mutate: buyUsage } = useMutation({
    mutationFn: async (type: keyof typeof USAGE_COSTS) => {
      const cost = USAGE_COSTS[type];
      if (user!.credits < cost) {
        throw new Error('Not enough credits');
      }

      updateCredits(-cost);

      await db.creditTransaction.create({
        data: {
          userId: user!.id,
          amount: -cost,
          type: type as any,
          source: 'usage_purchase',
          description: `Purchased ${type.replace(/_/g, ' ')}`,
        },
      });

      addNotification({
        type: 'success',
        message: `Purchased ${type.replace(/_/g, ' ')} for ${cost} credits`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Purchase failed',
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between sm:flex-col sm:items-start gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Rewards & Credits</h1>
              <p className="text-muted-foreground">
                Earn credits by watching ads and completing habits
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 px-6 py-4 rounded-2xl flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium uppercase tracking-wider">Balance</p>
                <p className="font-display text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {user?.credits || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Watching Section */}
        <div className="bg-gradient-to-br from-boost-blue to-boost-purple rounded-3xl p-6 shadow-glow mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Watch Rewarded Ads</h2>
            <p className="text-purple-100 mb-6">
              Earn {CREDIT_RULES.AD_REWARD} credits per ad
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-200">Ads Watched Today</span>
                <span className="text-white font-medium">{adsWatched}/{CREDIT_RULES.MAX_ADS_PER_DAY}</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(adsWatched / CREDIT_RULES.MAX_ADS_PER_DAY) * 100}%` }} />
              </div>
              <p className="text-xs text-purple-200 text-center">
                {canWatchMoreAds ? `${remainingAds} ads remaining today` : 'Daily ad limit reached'}
              </p>
            </div>

            <button
              onClick={() => watchAd()}
              disabled={!canWatchMoreAds}
              className={cn(
                'w-full py-4 px-6 rounded-2xl font-bold transition-all duration-200 shadow-soft',
                canWatchMoreAds
                  ? 'bg-white text-boost-blue hover:bg-purple-100'
                  : 'bg-white/20 text-purple-300 cursor-not-allowed'
              )}
            >
              {canWatchMoreAds ? (
                <>
                  <Film className="w-5 h-5 mr-2" />
                  Watch Ad (+{CREDIT_RULES.AD_REWARD} credits)
                </>
              ) : (
                'Limit Reached Today'
              )}
            </button>

            <p className="text-xs text-purple-200 mt-3 text-center">
              Max {CREDIT_RULES.MAX_CREDITS_FROM_ADS} credits/day from ads
            </p>
          </div>
        </div>

        {/* Credit Usage Options */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4">Spend Your Credits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <UsageCard
              title="Streak Save"
              cost={USAGE_COSTS.STREAK_SAVE}
              icon={<Shield className="w-5 h-5" />}
              description="Protect your streak from breaking"
              onClick={() => buyUsage('STREAK_SAVE')}
            />
            <UsageCard
              title="Remove Ads (1 Day)"
              cost={USAGE_COSTS.ADS_FREE_DAY}
              icon={<Clock className="w-5 h-5" />}
              description="Ad-free experience for 24 hours"
              onClick={() => buyUsage('ADS_FREE_DAY')}
            />
            <UsageCard
              title="Unlock Themes"
              cost={USAGE_COSTS.THEME_UNLOCK}
              icon={<Palette className="w-5 h-5" />}
              description="Access premium theme options"
              onClick={() => buyUsage('THEME_UNLOCK')}
            />
            <UsageCard
              title="Extra Habit Slot"
              cost={USAGE_COSTS.EXTRA_HABIT_SLOT}
              icon={<Plus className="w-5 h-5" />}
              description="Add more habit tracking slots"
              onClick={() => buyUsage('EXTRA_HABIT_SLOT')}
            />
            <UsageCard
              title="Export Reports"
              cost={USAGE_COSTS.EXPORT_REPORTS}
              icon={<Download className="w-5 h-5" />}
              description="Download your habit data"
              onClick={() => buyUsage('EXPORT_REPORTS')}
            />
            <UsageCard
              title="Special Offer"
              cost={0}
              icon={<Flame className="w-5 h-5 text-orange-500" />}
              description="Hidden plan unlock"
              onClick={() => {}}
              premium
            />
          </div>
        </div>

        {/* Credit History */}
        <div className="bg-card border border-border rounded-3xl shadow-soft">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold text-lg">Credit History</h2>
          </div>
          <div className="p-0">
            {/* Would fetch real transactions here */}
            <div className="p-6 text-center text-muted-foreground">
              <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Complete habits or watch ads to earn credits</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function UsageCard({ title, cost, icon, description, onClick, premium }: {
  title: string;
  cost: number;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  premium?: boolean;
}) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-2xl p-5 transition-all hover:shadow-soft cursor-pointer group',
      premium && 'border-purple-200 bg-purple-50/50'
    )} onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {premium && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            🎉 Special
          </span>
        )}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold">{cost}</span>
        <span className="text-xs text-muted-foreground">credits</span>
      </div>
    </div>
  );
}
