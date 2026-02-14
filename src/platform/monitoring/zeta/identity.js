/**
 * Zeta Global CDP user identity management.
 *
 * Sends user identification data to Zeta when authentication state
 * changes. Only transmits anonymous user IDs — no PII (email, name)
 * is sent to the CDP.
 *
 * @module platform/monitoring/zeta/identity
 * @see https://docs.zetaglobal.com/reference/update-user
 */

/**
 * Identifies the current user to Zeta Global's CDP.
 *
 * Called when a user logs in or when authenticated profile data loads.
 * Only sends the veteran's opaque user ID — no personally identifiable
 * information.
 *
 * @param {object} profile - The user profile from Redux state (user.profile).
 * @param {string} profile.accountUuid - The user's account UUID.
 */
export const identifyZetaUser = profile => {
  if (!profile?.accountUuid || typeof window.bt !== 'function') return;

  window.bt('updateUser', {
    // eslint-disable-next-line camelcase
    user_id: profile.accountUuid,
  });
};

/**
 * Clears the current session identity in Zeta when a user logs out.
 * This resets the session to anonymous tracking via the Zync_ID cookie.
 */
export const clearZetaIdentity = () => {
  if (typeof window.bt !== 'function') return;
  window.bt('clearSessionIdentity');
};
