import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { moveAPI } from "@/api/moveAPI";


/**
 * Retrieves user token from a cookie on the server.
 * @returns Raw value from the user token cookie, or undefined if not found.
 */
async function getUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user_token");
  return cookie?.value;
}


/**
 * Gets a valid user token or redirects to login page if not authenticated.
 */
export async function getValidUserTokenOrRedirect(): Promise<string | void> {
  const userToken = await getUserToken();
  if (!userToken) {
    redirect("/login");
  }

  const user = await moveAPI.getMe(userToken);
  if (!user) {
    redirect("/login");
  }

  return userToken;
}

/**
 * Redirects to home page if the user is already authenticated.
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const userToken = await getUserToken();
  if (userToken) {
    const user = await moveAPI.getMe(userToken);
    if (user) {
      redirect("/");
    }
  }
}
