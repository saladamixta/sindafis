export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const readOAuthPortalUrl = () => {
  const value = import.meta.env.VITE_OAUTH_PORTAL_URL;
  return typeof value === "string" && value.trim().length > 0
    ? value.trim().replace(/\/$/, "")
    : null;
};

export const hasOAuthLogin = () => Boolean(readOAuthPortalUrl());

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = readOAuthPortalUrl();
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    return null;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
