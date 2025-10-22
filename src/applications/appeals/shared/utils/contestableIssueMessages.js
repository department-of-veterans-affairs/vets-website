import { getTomorrowFormatted, getCurrentTimeZoneAbbr } from './dates';

/**
 * Formats an array of issue names into a natural language list
 * @param {string[]} names - Array of issue names
 * @returns {string} Formatted list (e.g., "A", "A and B", "A, B, and C")
 */
export const formatIssueList = names => {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
};

/**
 * Extracts display names from contestable issue objects
 * @param {Object[]} blockedIssues - Array of contestable issue objects
 * @returns {string[]} Array of issue display names
 */
export const extractIssueNames = blockedIssues =>
  blockedIssues.map(
    issue => issue.issue || issue.ratingIssueSubjectText || 'Unknown condition',
  );

/**
 * Generates blocked issue alert message with specific condition names
 * @param {Object[]} blockedIssues - Array of blocked contestable issue objects
 * @param {Object} dateOverrides - Optional date overrides for testing
 * @param {string} dateOverrides.tomorrow - Override tomorrow's formatted date
 * @param {string} dateOverrides.timezone - Override timezone abbreviation
 * @returns {string} Formatted blocked message or empty string if no blocked issues
 */
export const getBlockedMessage = (blockedIssues, dateOverrides = {}) => {
  if (!blockedIssues?.length) {
    return '';
  }

  const issues = extractIssueNames(blockedIssues);
  const tomorrow = dateOverrides.tomorrow || getTomorrowFormatted();
  const timezone = dateOverrides.timezone || getCurrentTimeZoneAbbr();
  const isSingle = issues.length === 1;

  return `We're sorry. ${formatIssueList(issues)} ${
    isSingle ? "isn't" : "aren't"
  } available to add to your appeal yet. You can come back and select ${
    isSingle ? 'it' : 'them'
  } after ${tomorrow}, 12:00 a.m. ${timezone}.`;
};
