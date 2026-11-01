import { cookies } from "next/headers";
import { getUserById } from "@/lib/store";
import type { User } from "@/lib/types";

export const SESSION_COOKIE = "expense_tracker_session";

export async function signInUser(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function signOutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return user;
}
