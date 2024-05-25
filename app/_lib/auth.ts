import NextAuth, { Session } from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest } from "next/server";

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
      const { auth } = params;
      return !!auth?.user;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
