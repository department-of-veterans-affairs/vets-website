/**
 * Prefix for session storage keys related to referral start times.
 * @constant {string}
 */
const KEY_PREFIX = 'referral_start_time_';

/**
 * Starts the referral timer for a given ID.
 * If a start time already exists in session storage, it will not be overwritten.
 *
 * @param {string} id - The unique identifier for the referral.
 * @returns {void}
 */
const startReferralTimer = id => {
  if (!id) {
    return;
  }
  const key = KEY_PREFIX + id;
  // If time already exist within the session don't re set it to a later date.
  const existingStartTime = sessionStorage.getItem(key);
  if (existingStartTime) {
    return;
  }

  const now = new Date();
  sessionStorage.setItem(key, now.toISOString());
};

/**
 * Gets the elapsed time in seconds since the referral timer started for a given ID.
 * Returns 0 if no start time exists or if the ID is invalid.
 *
 * @param {string} id - The unique identifier for the referral.
 * @returns {number} The elapsed time in seconds, or 0 if no start time exists.
 */
const getReferralElapsedSeconds = id => {
  if (!id) {
    return 0;
  }
  const key = KEY_PREFIX + id;
  const savedStartTime = sessionStorage.getItem(key);

  if (!savedStartTime) {
    return 0;
  }

  const now = new Date();
  const savedDate = new Date(savedStartTime);
  return Math.floor((now.getTime() - savedDate.getTime()) / 1000); // Elapsed time in seconds
};

/**
 * Clears the referral timer for a given ID.
 *
 * @param {string} id - The unique identifier for the referral.
 * @returns {void}
 */
const clearReferralTimer = id => {
  if (!id) {
    return;
  }
  const key = KEY_PREFIX + id;
  sessionStorage.removeItem(key);
};

export { getReferralElapsedSeconds, startReferralTimer, clearReferralTimer };
