import { MAX_LENGTH, SUBMITTED_DISAGREEMENTS } from '../constants';
import { replaceSubmittedData } from './replace';

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
