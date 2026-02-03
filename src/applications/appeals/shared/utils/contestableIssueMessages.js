import { add } from 'date-fns';
import {
  formatDatePart,
  formatDateWithMidnight,
  formatDateWithTime,
  getCurrentTimeZoneAbbr,
  parseDateToDateObj,
  toUTCStartOfDay,
} from './dates';
import { FORMAT_YMD_DATE_FNS } from '../constants';

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
