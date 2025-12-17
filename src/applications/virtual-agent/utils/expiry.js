// Expiry helpers for chatbot token handling
// Centralizes TTL parsing and alert-threshold calculations

export const DEFAULT_TTL_SECONDS = 3600; // 1 hour
export const EXPIRY_ALERT_BUFFER_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Parse a TTL value (in seconds) from the backend.
 * Falls back to DEFAULT_TTL_SECONDS when invalid.
 */
export function parseTTLSeconds(rawTtl) {
  const n = Number(rawTtl);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_TTL_SECONDS;
}

/**
 * Compute the timestamp at which we should show the expiry alert.
 * This is the token expiry minus a buffer to avoid racing with expiry.
 */
export function getAlertTargetTs(expiresAt) {
  return expiresAt ? expiresAt - EXPIRY_ALERT_BUFFER_MS : null;
}

/**
 * Determine if the expiry alert should be shown at the current moment.
 */
export function shouldShowExpiryAlertAt(expiresAt) {
  const target = getAlertTargetTs(expiresAt);
  return target !== null && Date.now() >= target;
}
