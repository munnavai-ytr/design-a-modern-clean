'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Shield, Flame, Crown, Gift, Lock, CheckCircle } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';
import { PLAN_PRICES, PLAN_FEATURES } from '@/lib/constants';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const { hasHiddenPlanUnlocked, unlockHiddenPlan } = useSubscriptionStore();

  const plans = [
    {
      name: 'Free',
      price: 'Free',
      description: 'Get started with basic habit tracking',
      features: PLAN_FEATURES[PLAN_PRICES.FREE],
      popular: false,
    },
    {
      name: 'Pro',
      price: '৳199/month',
      description: 'Advanced features for serious habit builders',
      features: PLAN_FEATURES[PLAN_PRICES.PRO],
      popular: true,
    },
    {
      name: 'Premium',
      price: '৳499/month',
      description: 'Everything you need to build lasting habits',
      features: PLAN_FEATURES[PLAN_PRICES.PREMIUM],
      popular: false,
    },
    ...(hasHiddenPlanUnlocked ? [{
      name: 'Special Boost',
      price: '৳999/one-time',
      description: '🎉 Exclusive hidden plan with all features unlocked forever',
      features: { ads: false, maxHabits: -1, analytics: true, bonusCredits: 500 },
      popular: false,
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Upgrade to unlock more habits, analytics, and premium features
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'bg-card border rounded-3xl p-6 relative transition-all hover:shadow-lg',
                plan.popular ? 'border-primary ring-1 ring-primary' : 'border-border',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                  Most Popular
                </div>
              )}
              <h2 className="font-display text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-lg font-bold mb-4">{plan.price}</p>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-6">
                {Object.entries(plan.features).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    ads: 'Banner Ads',
                    maxHabits: 'Max Habits',
                    analytics: 'Analytics',
                    bonusCredits: 'Bonus Credits',
                  };
                  return (
                    <li key={key} className="flex items-center gap-2">
                      <span className={value ? 'text-green-500' : 'text-muted-foreground'}>
                        {value ? '✓' : '✗'}
                      </span>
                      <span className="text-sm">{labels[key] || key}: {value === true ? 'Included' : value === false ? 'Not included' : value === -1 ? 'Unlimited' : value}</span>
                    </li>
                  );
                })}
              </ul>
              <button className="w-full py-3 px-4 rounded-2xl font-medium shadow-soft transition-all flex items-center justify-center gap-2">
                {plan.popular ? (
                  <>
                    <Crown className="w-4 h-4" /> Subscribe to Pro
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" /> Subscribe to {plan.name}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Hidden Plan Section */}
        {hasHiddenPlanUnlocked && (
          <div className="bg-gradient-to-r from-boost-blue to-boost-purple rounded-3xl p-8 shadow-glow mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">🎉 Special Offer Unlocked</h2>
              <p className="text-purple-100 mb-6">
                Congratulations! You've unlocked the exclusive Special Boost plan.
              </p>
              <button className="px-8 py-3 rounded-2xl bg-white text-boost-blue font-bold shadow-soft hover:bg-purple-100 transition-all">
                Claim Special Boost
              </button>
            </div>
          </div>
        )}

        {/* Hidden Plan Unlock */}
        {!hasHiddenPlanUnlocked && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft mb-10">
            <h2 className="font-semibold text-lg mb-4">Unlock Hidden Plan</h2>
            <p className="text-muted-foreground mb-4">
              Have a special unlock code? Enter it below to reveal exclusive offers.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter unlock code"
                className="w-full pl-3 py-2 rounded-2xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              <button className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all">
                Unlock
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
