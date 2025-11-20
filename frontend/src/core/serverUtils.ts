import "server-only";
import { cookies } from "next/headers";


/**
 * Retrieves user token from a cookie on the server.
 * @returns Raw value from the user token cookie, or undefined if not found.
 */
export async function getUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user_token");
  return cookie?.value;
}
