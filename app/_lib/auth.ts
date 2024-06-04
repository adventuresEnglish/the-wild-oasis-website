import NextAuth, { Account, Profile } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import { NextRequest } from "next/server";
import { createGuest, getGuest } from "./data-service";
import { Session, User } from "./types";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized(params: {
      request: NextRequest;
      auth: Session | null;
    }): boolean {
      return !!params.auth?.user;
    },

    async signIn(params: {
      user: AdapterUser | User;
      account: Account | null;
      profile?: Profile | undefined;
      email?: { verificationRequest?: boolean | undefined } | undefined;
      credentials?: Record<string, unknown> | undefined;
    }) {
      const { user } = params;
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest) {
          if (typeof user.email === "string" && typeof user.name === "string") {
            await createGuest({ email: user.email, fullName: user.name });
          }
        }

        return true;
      } catch {
        return false;
      }
    },

    async session({ session }: { session: Session & { user?: User } }) {
      if (session.user) {
        const guest = await getGuest(session.user.email);
        session.user.guestId = guest.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
