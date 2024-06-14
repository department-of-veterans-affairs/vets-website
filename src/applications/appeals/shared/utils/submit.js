import { MAX_LENGTH, SELECTED, SUBMITTED_DISAGREEMENTS } from '../constants';
import { fixDateFormat, replaceSubmittedData } from './replace';
import { returnUniqueIssues } from './issues';

/**
 * Remove objects with empty string values; Lighthouse doesn't like `null`
 *  values
 * @param {Object}
 * @returns {Object} minus any empty string values
 */
export const removeEmptyEntries = object =>
  Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== ''),
  );

/**
 * Combine issues values into one field
 * @param {ContestableIssueAttributes} attributes
 * @returns {String} Issue name - rating % - description combined
 */
export const createIssueName = ({ attributes } = {}) => {
  const {
    ratingIssueSubjectText,
    ratingIssuePercentNumber,
    description,
  } = attributes;
  const result = [
    ratingIssueSubjectText,
    `${ratingIssuePercentNumber || '0'}%`,
    description,
  ]
    .filter(part => part)
    .join(' - ');
  return replaceSubmittedData(result).substring(0, MAX_LENGTH.ISSUE_NAME);
};

/* submitted contested issue format
[{
  "type": "contestableIssue",
  "attributes": {
    "issue": "tinnitus - 10% - some longer description",
    "decisionDate": "1900-01-01",
    "decisionIssueId": 1,
    "ratingIssueReferenceId": "2",
    "ratingDecisionReferenceId": "3",
    "socDate": "2000-01-01"
  }
}]
*/
export const getContestedIssues = ({ contestedIssues } = {}) =>
  (contestedIssues || []).filter(issue => issue[SELECTED]).map(issue => {
    const attr = issue.attributes;
    const attributes = [
      'decisionIssueId',
      'ratingIssueReferenceId',
      'ratingDecisionReferenceId',
      'socDate',
    ].reduce(
      (acc, key) => {
        // Don't submit null or empty strings
        if (attr[key]) {
          acc[key] = attr[key];
        }
        return acc;
      },
      {
        issue: createIssueName(issue),
        decisionDate: fixDateFormat(attr.approxDecisionDate),
      },
    );

    return {
      // type: "contestableIssues"
      type: issue.type,
      attributes,
    };
  });

/**
 * Combine included issues and additional issues
 * @param {FormData}
 * @returns {ContestableIssueSubmittable}
 */
export const addIncludedIssues = formData => {
  const issues = getContestedIssues(formData);

  const result = issues.concat(
    (formData.additionalIssues || []).reduce((issuesToAdd, issue) => {
      if (issue[SELECTED] && issue.issue && issue.decisionDate) {
        // match contested issue pattern
        issuesToAdd.push({
          type: 'contestableIssue',
          attributes: {
            issue: replaceSubmittedData(issue.issue),
            decisionDate: fixDateFormat(issue.decisionDate),
          },
        });
      }
      return issuesToAdd;
    }, []),
  );
  // Ensure only unique entries are submitted
  return returnUniqueIssues(result);
};

/**
 * Strip out extra profile phone data
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */
export const getPhone = ({ veteran = {} } = {}) => {
  const truncate = (value, max) =>
    replaceSubmittedData(veteran.phone?.[value] || '').substring(0, max);
  return removeEmptyEntries({
    countryCode: truncate('countryCode', MAX_LENGTH.PHONE_COUNTRY_CODE),
    areaCode: truncate('areaCode', MAX_LENGTH.PHONE_AREA_CODE),
    phoneNumber: truncate('phoneNumber', MAX_LENGTH.PHONE_NUMBER),
    phoneNumberExt: truncate('phoneNumberExt', MAX_LENGTH.PHONE_NUMBER_EXT),
  });
};

/**
 * Add area of disagreement
 * @param {ContestableIssueSubmittable} issues - selected & processed issues
 * @param {AreaOfDisagreement} areaOfDisagreement - in formData
 * @return {ContestableIssuesSubmittable} issues with "disagreementArea" added
 */
export const addAreaOfDisagreement = (issues, { areaOfDisagreement } = {}) => {
  const keywords = {
    serviceConnection: () => SUBMITTED_DISAGREEMENTS.serviceConnection,
    effectiveDate: () => SUBMITTED_DISAGREEMENTS.effectiveDate,
    evaluation: () => SUBMITTED_DISAGREEMENTS.evaluation,
  };
  return issues.map((issue, index) => {
    const entry = areaOfDisagreement[index];
    const reasons = Object.entries(entry?.disagreementOptions || {})
      .map(([key, value]) => value && keywords[key](entry))
      .concat((entry?.otherEntry || '').trim())
      .filter(Boolean);
    const disagreementArea = replaceSubmittedData(
      // max length in schema
      reasons.join(',').substring(0, MAX_LENGTH.DISAGREEMENT_REASON),
    );
    return {
      ...issue,
      attributes: {
        ...issue.attributes,
        disagreementArea,
      },
    };
  });
};

/**
 * Get timezone of user's computer
 * @example 'America/Los_Angeles'
 * @returns {String} Valid Lighthouse timezone string
 */
export const getTimeZone = () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // See https://dsva.slack.com/archives/C05UPRR0HK3/p1715559455045739; DataDog
  // event where a Veteran submitted an HLR with 'Etc/Unknown` as the timezone,
  // but it was rejected by Lighthouse
  return timezone.toLowerCase().includes('unknown')
    ? 'America/New_York'
    : timezone;
};
