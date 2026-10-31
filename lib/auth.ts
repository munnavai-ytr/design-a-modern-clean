import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // This will be replaced with Prisma DB lookup once database is set up
        // For now, return a mock user structure
        return {
          id: '1',
          email: credentials.email,
          name: 'User',
          image: null,
          credits: 0,
          streak: 0,
          plan: 'free',
          referralCode: '',
          isVerified: false,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.credits = user.credits;
        token.streak = user.streak;
        token.plan = user.plan;
        token.referralCode = user.referralCode;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
        session.user.streak = token.streak as number;
        session.user.plan = token.plan as string;
        session.user.referralCode = token.referralCode as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'dailyboost-secret-key-change-in-production',
};
