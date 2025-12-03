import { add } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { parseDateToDateObj, toUTCStartOfDay } from './dates';
import { FORMAT_YMD_DATE_FNS } from '../constants';

const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Get the current timezone abbreviation (e.g., "PST", "EST", "JST")
 * Uses date-fns-tz to properly handle DST (EDT vs EST, PDT vs PST, etc.)
 * @returns {string} Timezone abbreviation
 */
const getCurrentTimeZoneAbbr = () => {
  const timezone = USER_TIMEZONE;
  const now = new Date();

  return formatInTimeZone(now, timezone, 'zzz');
};

/**
 * Helper: Format date part in readable format
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone (defaults to user's current timezone)
 * @returns {string} Formatted date (e.g., "January 15, 2024")
 */
const formatDatePart = (date, timezone = USER_TIMEZONE) => {
  return formatInTimeZone(date, timezone, 'MMMM d, yyyy');
};

/**
 * Helper: Format time part in readable format
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone (defaults to user's current timezone)
 * @returns {string} Formatted time (e.g., "3:45 p.m.")
 */
const formatTimePart = (date, timezone = USER_TIMEZONE) => {
  // Use date-fns-tz to format time with proper AM/PM formatting
  const timeString = formatInTimeZone(date, timezone, 'h:mm a');
  // Convert "AM" to "a.m." and "PM" to "p.m." to match VA style guide
  return timeString.replace(/AM/g, 'a.m.').replace(/PM/g, 'p.m.');
};

/**
 * Helper: Format date with midnight in local timezone
 * E.g., in California (UTC-8), if decision was today, UTC midnight tomorrow converts to 5:00 p.m. today
 * Business decision: Don't allow same-day appeals, so we show stable "12:00 a.m. tomorrow" format
 * @param {Date} date - Date to format
 * @param {string} timezoneAbbr - Timezone abbreviation (optional, will be determined automatically)
 * @returns {string} Formatted date with midnight time
 */
const formatDateWithMidnight = (date, timezoneAbbr) => {
  const userTimezone = USER_TIMEZONE;
  const abbr = timezoneAbbr || getCurrentTimeZoneAbbr();
  return `${formatDatePart(date, userTimezone)}, 12:00 a.m. ${abbr}`;
};

/**
 * Helper: Format date with specific time in local timezone
 * Used for showing UTC conversion times, e.g., in Japan (UTC+9), UTC midnight becomes 9:00 a.m. JST
 * @param {Date} date - Date to format
 * @param {string} timezoneAbbr - Timezone abbreviation (optional, will be determined automatically)
 * @returns {string} Formatted date with specific time
 */
const formatDateWithTime = (date, timezoneAbbr) => {
  const userTimezone = USER_TIMEZONE;
  const abbr = timezoneAbbr || getCurrentTimeZoneAbbr();
  const datePart = formatDatePart(date, userTimezone);
  const timePart = formatTimePart(date, userTimezone);
  return `${datePart}, ${timePart} ${abbr}`;
};

/**
 * Helper: Extract decision date from contestable issue object
 * @param {Object} issue - Contestable issue object from API
 * @returns {string} Decision date string
 * Note: Only used for API contestable issues (approxDecisionDate), not user-entered additional issues
 */
const getDecisionDate = issue => issue.approxDecisionDate;

/**
 * Helper: Check if UTC midnight falls on the same local day as decision date
 * @param {Date} decisionDate - The original decision date
 * @param {Date} utcMidnight - UTC midnight converted to local time
 * @returns {boolean} True if they fall on the same local day
 */
const isSameDayAsDecision = (decisionDate, utcMidnight) => {
  const decisionLocalDay = formatDatePart(decisionDate);
  const utcMidnightLocalDay = formatDatePart(utcMidnight);
  return decisionLocalDay === utcMidnightLocalDay;
};

/**
 * Calculate "available after" time based on blocking type
 * Single function that handles both local and UTC blocking scenarios
 * @param {string} decisionDate - The decision date in YYYY-MM-DD format
 * @param {string} blockingType - Either 'local' or 'utc'
 * @returns {string} Complete formatted datetime when available
 */
const getAvailableAfterDate = (decisionDate, blockingType) => {
  const parsedDate = parseDateToDateObj(decisionDate, FORMAT_YMD_DATE_FNS);
  const timezone = getCurrentTimeZoneAbbr();
  const nextLocalDay = add(parsedDate, { days: 1 });

  if (blockingType === 'local') {
    return formatDateWithMidnight(nextLocalDay, timezone);
  }

  const utcMidnight = toUTCStartOfDay(nextLocalDay);

  if (isSameDayAsDecision(parsedDate, utcMidnight)) {
    return formatDateWithMidnight(nextLocalDay, timezone);
  }

  // UTC midnight falls on a different local day than the decision date,
  // so show the actual converted time (e.g., "October 30, 2025, 5:00 p.m. PST")
  return formatDateWithTime(utcMidnight, timezone);
};

/**
 * Formats an array of issue names into a natural language list
 * Uses semicolons as separators between issues if any issue name contains a comma
 * @param {string[]} names - Array of issue names
 * @returns {string} Formatted list (e.g., "A", "A and B", "A, B, and C" or "A; B, C; D; and E")
 */
export const formatIssueList = names => {
  if (names.length === 1) return names[0];

  const hasCommaInNames = names.some(name => name.includes(','));
  const separator = hasCommaInNames ? '; ' : ', ';

  const lastItem = names[names.length - 1];

  if (names.length === 2) {
    const twoItemSeparator = hasCommaInNames ? '; and ' : ' and ';
    return `${names[0]}${twoItemSeparator}${lastItem}`;
  }

  const finalSeparator = hasCommaInNames ? '; ' : ', ';
  return `${names
    .slice(0, -1)
    .join(separator)}${finalSeparator}and ${lastItem}`;
};

/**
 * Extracts display names from contestable issue objects
 * @param {Object[]} blockedIssues - Array of contestable issue objects
 * @returns {string[]} Array of issue display names (lowercase)
 */
export const extractIssueNames = blockedIssues =>
  blockedIssues.map(issue => {
    const name = issue.issue || issue.ratingIssueSubjectText;
    return name.toLowerCase();
  });

/**
 * Generates blocked issue alert message based on dual validation decision tree
 * - If blocked by local "same day": Show "wait until next day local time"
 * - If blocked by UTC validation: Show "wait until next day UTC time (in local time)"
 * @param {Object[]} blockedIssues - Array of blocked contestable issue objects
 * @returns {string} Formatted blocked message or empty string if no blocked issues
 */
export const getBlockedMessage = blockedIssues => {
  if (!blockedIssues?.length) {
    return '';
  }

  const issueNames = extractIssueNames(blockedIssues);
  const isSingle = issueNames.length === 1;
  const decisionDate = getDecisionDate(blockedIssues[0]);

  const { blockingType } = blockedIssues[0];
  const availableAfter = getAvailableAfterDate(decisionDate, blockingType);

  return `We're sorry. Your ${formatIssueList(issueNames)} ${
    isSingle ? 'issue' : 'issues'
  } ${
    isSingle ? "isn't" : "aren't"
  } available to add to your appeal yet. You can come back and select ${
    isSingle ? 'it' : 'them'
  } after ${availableAfter}.`;
};
