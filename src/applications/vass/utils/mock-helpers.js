const { addDays, addMinutes, format } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');

const TZ_ET = 'America/New_York';
const TZ_PT = 'America/Los_Angeles';

/**
 * Generates appointment time slots for weekdays over a specified period.
 *
 * Creates 30-min slots, excluding weekends.
 * ONLY returns slots that are within 8AM–5PM in BOTH ET and PT (overlap window),
 * and returns timestamps in ISO 8601 UTC (Z).
 *
 * @param {number} numberOfDays - Number of days to generate slots for (default: 14)
 * @param {number} slotsPerDay - Max number of time slots per day to return (default: 12) Must be less than or equal to 12.
 * @returns {Array<{start: string, end: string}>} Array of slot objects with ISO timestamp strings (UTC)
 *
 * @example
 * const slots = generateSlots(7, 10);
 * // Returns 10 slots per weekday for the next 7 days
 * // Each slot: { dtStartUtc: '2025-11-27T08:00:00.000Z', dtEndUtc: '2025-11-27T08:30:00.000Z' }
 */
const generateSlots = (numberOfDays = 14, slotsPerDay = 12) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: numberOfDays }, (_, index) =>
    addDays(today, index + 1),
  ).filter(date => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Skip weekends (0 = Sunday, 6 = Saturday)
  });

  return days.flatMap(date => {
    const yyyyMmDd = format(date, 'yyyy-MM-dd');

    // Business-hour boundaries in each timezone (local wall-clock)
    const etStartUtc = zonedTimeToUtc(`${yyyyMmDd}T08:00:00`, TZ_ET);
    const etEndUtc = zonedTimeToUtc(`${yyyyMmDd}T17:00:00`, TZ_ET);

    const ptStartUtc = zonedTimeToUtc(`${yyyyMmDd}T08:00:00`, TZ_PT);
    const ptEndUtc = zonedTimeToUtc(`${yyyyMmDd}T17:00:00`, TZ_PT);

    // Overlap window in UTC: [max(starts), min(ends)]
    const windowStartUtc = new Date(
      Math.max(etStartUtc.getTime(), ptStartUtc.getTime()),
    );
    const windowEndUtc = new Date(
      Math.min(etEndUtc.getTime(), ptEndUtc.getTime()),
    );

    // If no overlap (shouldn't happen for ET/PT), return no slots
    if (windowStartUtc >= windowEndUtc) return [];

    // Build 30-min slots within the overlap, starting on the hour/half-hour
    const slots = [];
    let cursor = new Date(windowStartUtc);

    // Ensure cursor is aligned to :00 or :30 (in UTC)
    const m = cursor.getUTCMinutes();
    if (m !== 0 && m !== 30) {
      const bump = m < 30 ? 30 - m : 60 - m;
      cursor = addMinutes(cursor, bump);
    }
    cursor.setUTCSeconds(0, 0);

    while (cursor < windowEndUtc && slots.length < slotsPerDay) {
      const end = addMinutes(cursor, 30);
      if (end <= windowEndUtc) {
        slots.push({
          dtStartUtc: cursor.toISOString(),
          dtEndUtc: end.toISOString(),
        });
      }
      cursor = addMinutes(cursor, 30);
    }

    return slots;
  });
};

/**
 * Base64 URL encode a string (for mock JWT creation)
 * @param {string} data - The string to encode
 * @returns {string} Base64 URL encoded string
 */
function base64UrlEncode(data) {
  if (!data) return null;

  const base64 = Buffer.from(data, 'utf8').toString('base64');

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Creates a mock JWT token for testing purposes.
 *
 * @param {string} uuid - The UUID of the start schedule url param
 * @param {number} expiresIn - The number of seconds until the token expires (default: 3600 seconds = 1 hour)
 * @returns {string} The mock JWT token
 */
function createMockJwt(uuid, expiresIn = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  // TODO: confirm the payload structure
  const defaultPayload = {
    sub: uuid,
    jti: 'mock-jti',
    iat: now,
    exp: now + expiresIn,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(defaultPayload));
  const mockSignature = base64UrlEncode('mock-signature');

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}

module.exports = { generateSlots, createMockJwt };
