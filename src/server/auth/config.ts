import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/server/db";
import { UserRole } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }

  interface JWT {
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT strategy instead of database sessions,
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Handle new user registration
      if (account?.provider === "google") {
        try {
          // Use the stable Google sub ID as the user ID
          const googleId = profile?.sub as string;
          
          // Check if user exists by Google ID
          const existingUser = await db.user.findUnique({
            where: { id: googleId },
          });

          if (!existingUser) {
            // Create new user with Google ID as the stable identifier
            await db.user.create({
              data: {
                id: googleId,
                email: user.email!,
                name: user.name,
                image: user.image,
                role: UserRole.USER, // Default role for new users
              },
            });
          }
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    jwt: async ({ token, user, account, profile }) => {
      // When signing in, add the user data to the token
      if (account?.provider === "google" && profile) {
        const googleId = profile.sub as string;
        token.sub = googleId; // Use Google's stable sub as the user ID
        
        // Fetch user role from database
        const dbUser = await db.user.findUnique({
          where: { id: googleId },
          select: { role: true }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      // Add id and role to session from JWT token
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as unknown as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;