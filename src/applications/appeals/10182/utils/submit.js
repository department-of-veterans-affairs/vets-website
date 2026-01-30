import { MAX_LENGTH, SELECTED } from '../../shared/constants';
import '../../shared/definitions';
import { returnUniqueIssues } from '../../shared/utils/issues';
import { replaceSubmittedData } from '../../shared/utils/replace';
import { fixDateFormat } from '../../shared/utils/dates';
import { removeEmptyEntries, getIso2Country } from '../../shared/utils/submit';

/**
 * Combine issues values into one field
 * @param {ContestableIssueAttributes} attributes
 * @returns {String} Issue name - rating % - description combined
 */
export const createIssueName = ({ attributes = {} } = {}) => {
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
  return replaceSubmittedData(result).substring(0, MAX_LENGTH.NOD_ISSUE_NAME);
};

/**
 * Get array of submittable contestable issues
 * @param {ContestableIssues}
 * @returns {ContestableIssueSubmittable}
 */
export const getContestableIssues = ({ contestedIssues } = {}) =>
  (contestedIssues || []).filter(issue => issue[SELECTED]).map(issue => {
    const attr = issue.attributes;
    const attributes = [
      'decisionIssueId',
      'ratingIssueReferenceId',
      'ratingDecisionReferenceId',
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
      type: issue.type,
      attributes,
    };
  });

/**
 * Combine included issues and additional issues
 * @param {FormData}
 * @returns {ContestableIssuesSubmittable}
 */
export const addIncludedIssues = formData => {
  const issues = getContestableIssues(formData);

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
 * @typedef Evidence
 * @type {Array<Object>}
 * @property {EvidenceFile}
 */
/**
 * @typedef EvidenceFile - user-uploaded evidence files
 * @type {Object}
 * @property {String} name - uploaded file name
 * @property {String} confirmationCode - UUID returned by upload API
 * @property {Boolean} isEncrypted - (not currently used) flag indicating that
 *  the file _was_ an encrypted PDF, but was unencrypted after processing it
 *  with the user provided password (not yet implemented)
 */
/**
 * @typedef EvidenceSubmittable
 * @type {Object}
 * @property {String} name - uploaded file name
 * @property {String} confirmationCode - UUID returned by upload API
 */
/**
 * Return processed array of file uploads
 * @param {FormData}
 * @returns {EvidenceSubmittable[]}
 */
export const addUploads = formData =>
  formData.boardReviewOption === 'evidence_submission' &&
  formData['view:additionalEvidence']
    ? formData.evidence.map(({ name, confirmationCode }) => ({
        name: replaceSubmittedData(name),
        confirmationCode,
      }))
    : [];

/**
 * Strip out extra profile home address data & rename zipCode to zipCode5
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */
export const getAddress = (formData = {}) => {
  const { veteran = {} } = formData;
  const truncate = (value, max) =>
    replaceSubmittedData(veteran.address?.[value] || '').substring(0, max);
  // note "ISO2" is submitted, "Iso2" is from profile address
  const countryCodeISO2 = getIso2Country(veteran.address).substring(
    0,
    MAX_LENGTH.ADDRESS_COUNTRY,
  );
  // international postal code can be undefined/null
  const internationalPostalCode = truncate(
    'internationalPostalCode',
    MAX_LENGTH.POSTAL_CODE,
  );
  // zipCode5 is always required, set to 00000 for addresses outside the U.S.
  // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/shared/v0/address.json#L34
  const zipCode5 =
    countryCodeISO2 !== 'US' || veteran.address?.countryCodeIso2 !== 'US'
      ? '00000'
      : truncate('zipCode', MAX_LENGTH.ZIP_CODE5);
  return removeEmptyEntries({
    addressLine1: truncate('addressLine1', MAX_LENGTH.ADDRESS_LINE1),
    addressLine2: truncate('addressLine2', MAX_LENGTH.ADDRESS_LINE2),
    addressLine3: truncate('addressLine3', MAX_LENGTH.ADDRESS_LINE3),
    city: truncate('city', MAX_LENGTH.CITY),
    stateCode: veteran.address?.stateCode || '',
    countryCodeISO2,
    zipCode5,
    internationalPostalCode,
  });
};

/**
 * Return v0 or v1 key with email data
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable email
 */
export const getEmail = (formData = {}) => {
  // v0 uses emailAddressText
  // v1 uses email
  return { email: formData.veteran?.email || '' };
};

/**
 *
 * @param {Boolean} requestingExtension - yes/no indicating the Veteran is
 *   requesting an extension
 * @param {String} extensionReason - Text of why the Veteran is requesting an
 *   extension
 * @param {Boolean} appealingVHADenial - yes/no indicating the Veteran is
 *   appealing a VHA denial
 * @returns {Object} data from part III, box 11 of form expiring on 3/31/2025
 */
export const getPart3Data = formData => {
  const {
    requestingExtension = false,
    extensionReason = '',
    appealingVHADenial = false,
  } = formData;
  const result = {
    requestingExtension,
    /* - Lighthouse is expecting `appealingVhaDenial`
     * - Save-in-progress renames `appealingVhaDenial` to `appealingVHADenial`
     *   so we just kept the all-cap VHA within the form data */
    appealingVhaDenial: appealingVHADenial,
  };
  if (requestingExtension) {
    result.extensionReason = extensionReason;
  }
  return result;
};
