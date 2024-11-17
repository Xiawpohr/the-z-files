import { headers } from "next/headers";

export function currentURL(pathname: string): URL {
  try {
    const headersList = headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";

    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    console.error(error);
    return new URL("http://localhost:3000");
  }
}

export function appURL() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  } else {
    const url = process.env.APP_URL || vercelURL() || "http://localhost:3000";
    console.warn(
      `Warning (examples): APP_URL environment variable is not set. Falling back to ${url}.`
    );
    return url;
  }
}

export function vercelURL() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
}

export function createConverseGroupURL(groupId: string) {
  const baseURL = "https://converse.xyz/group"
  return new URL(groupId, baseURL).toString();
}

export function createExampleURL(path: string) {
  return new URL(path, appURL()).toString();
}

const DEFAULT_DEBUGGER_URL =
  process.env.DEBUGGER_URL || "http://localhost:3010/";

export const DEFAULT_DEBUGGER_HUB_URL =
  process.env.NODE_ENV === "development"
    ? new URL("/hub", DEFAULT_DEBUGGER_URL).toString()
    : undefined;

export function createTransactionURL(txHash: string) {
  return new URL(`/${txHash}`, "https://filecoin.blockscout.com/api/v2/transactions/").toString();
}