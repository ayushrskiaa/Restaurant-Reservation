import Constants from 'expo-constants';

/**
 * Config for the RN WebView wrapper app.
 *
 * The single source of truth for the web app URL is `app.json` → `expo.extra.webAppUrl`.
 * Override per-environment with `EXPO_PUBLIC_WEB_APP_URL` if you ever need to point
 * the app at a different deployment without editing app.json.
 */

const DEFAULT_WEB_APP_URL = 'https://restaurant-reservation-self-five.vercel.app';

export function getHostname(url = '') {
  try {
    return new URL(url).hostname;
  } catch {
    const match = url.match(/^https?:\/\/([^/:]+)/);
    return match ? match[1] : '';
  }
}

// ── Primary URL loaded by the root WebView ─────────────────────────────────
const envUrl = process.env.EXPO_PUBLIC_WEB_APP_URL;
const extraUrl = Constants.expoConfig?.extra?.webAppUrl;

export const WEB_APP_URL = envUrl || extraUrl || DEFAULT_WEB_APP_URL;

// ── Host allow-list ────────────────────────────────────────────────────────
const WEB_APP_HOST = getHostname(WEB_APP_URL);
const API_HOSTS = Constants.expoConfig?.extra?.apiHosts || [];

export const ALLOWED_HOSTS = [
  WEB_APP_HOST,
  // Dev convenience: frontend + API served locally
  'localhost',
  '127.0.0.1',
  // Razorpay checkout (loaded as a popup / new window)
  'razorpay.com',
  'api.razorpay.com',
  'checkout.razorpay.com',
  // Image CDNs used by the web app
  'res.cloudinary.com',
  'images.pexels.com',
  // Google Fonts
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  // Any extra hosts configured in app.json (e.g. the deployed API host)
  ...API_HOSTS,
]
  .filter(Boolean)
  .map((host) => host.toLowerCase());

export function isAllowedHost(host = '') {
  const h = host.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => h === allowed || h.endsWith(`.${allowed}`));
}

export function isWebAppPage(url = '') {
  const host = getHostname(url);
  return host === WEB_APP_HOST;
}