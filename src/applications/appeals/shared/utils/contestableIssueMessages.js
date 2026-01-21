import { getAvailableDateTimeForBlockedIssue } from '../validations/date';

/**
 * Helper: Extract decision date from contestable issue object
 * @param {Object} issue - Contestable issue object from API
 * @returns {string} Decision date string
 * Note: Only used for API contestable issues (approxDecisionDate), not user-entered additional issues
 */
const getDecisionDate = issue => issue.approxDecisionDate;

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
  const availableDateTime = getAvailableDateTimeForBlockedIssue(
    new Date(decisionDate),
  );

  return `We're sorry. Your ${formatIssueList(issueNames)} ${
    isSingle ? 'issue' : 'issues'
  } ${
    isSingle ? "isn't" : "aren't"
  } available to add to your appeal yet. You can come back and select ${
    isSingle ? 'it' : 'them'
  } after ${availableDateTime}.`;
};
