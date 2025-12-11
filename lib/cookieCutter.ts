function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
export async function parseAuthCookie(): Promise<boolean> {
  const authUi = getCookieValue("access_token");
  return Boolean(authUi);
}
