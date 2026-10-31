'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { User, Mail, CreditCard, Bell, Shield, LogOut, Edit, Save, Check } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');

  const handleSave = () => {
    setIsEditing(false);
    // Would call API to update profile
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft mb-6">
          <div className="bg-gradient-to-br from-boost-blue to-boost-purple p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">{session?.user?.name || 'User'}</h2>
                <p className="text-purple-100">{session?.user?.email || 'user@example.com'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full capitalize">{session?.user?.plan || 'Free'} Plan</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Personal Information</h3>
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <User className="w-5 h-5 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium"
                    />
                  ) : (
                    <span className="flex-1 text-sm font-medium">{session?.user?.name || 'User'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{session?.user?.email || 'user@example.com'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Account Balance</h3>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Available</p>
                    <p className="font-display text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {session?.user?.credits || 0}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 transition-colors">
                  Add Credits
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                    <p className="font-semibold">{session?.user?.streak || 0} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Habits Tracked</p>
                    <p className="font-semibold">12</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                    <p className="font-semibold">67%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-soft">
          <h3 className="font-semibold mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-destructive hover:bg-destructive/10 transition-colors text-left">
              <Shield className="w-5 h-5" />
              <span>Change Password</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-destructive hover:bg-destructive/10 transition-colors text-left">
              <Bell className="w-5 h-5" />
              <span>Notification Settings</span>
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
