import moment from 'moment';

import { SELECTED, MAX_LENGTH, SUBMITTED_DISAGREEMENTS } from '../constants';
import { replaceSubmittedData } from './replace';

/**
 * @typedef FormData
 * @type {Object<Object>}
 * @property {Veteran} veteran - data from prefill & profile
 * @property {ContestableIssues} contestableIssues - issues loaded from API
 * @property {AdditionaIssues} additionalIssues - issues entered by Veteran
 * @property {Evidence} evidence - Evidence uploaded by Veteran
 * @property {Boolean} homeless - homeless choice
 * @property {String} boardReviewOption - Veteran selected review option - enum
 *   to "direct_review", "evidence_submission" or "hearing"
 * @property {String} hearingTypePreference - Vetera selected hearing type -
 *   enum to "virtual_hearing", "video_conference" or "central_office"
 * @property {Boolean} socOptIn - check box indicating the Veteran has opted in
 *   to the new appeal process (always false)
 * @property {Boolean} view:additionalEvidence - Veteran choice to upload more
 *   evidence
 */
/**
 * @typedef Veteran
 * @type {Object}
 * @property {String} ssnLastFour - Last four of SSN from prefill
 * @property {String} vaFileLastFour - Last four of VA file number from prefill
 * @property {Object<String>} address - Veteran's home address from profile
 * @property {Object<String>} phone - Veteran's home phone from profile
 * @property {Object<String>} email - Veteran's email from profile
 */
/**
 * @typedef ContestableIssues
 * @type {Array<Object>}
 * @property {ContestableIssue~Item}
 */
/**
 * @typedef ContestableIssue~Item
 * @type {Object}
 * @property {String} type - always set to "contestableIssue"
 * @property {ContestableIssue~Attributes} attributes - essential properties
 * @property {Boolean} 'view:selected' - internal boolean indicating that the
 *   issue has been selected by the user
 */
/**
 * @typedef ContestableIssue~Attributes
 * @type {Object}
 * @property {String} ratingIssueSubjectText - title of issue
 * @property {String} description - issue description
 * @property {Number} ratingIssuePercentNumber - disability rating percentage
 * @property {String} approxDecisionDate - decision date (YYYY-MM-DD)
 * @property {Number} decisionIssueId - decision id
 * @property {String} ratingIssueReferenceId - issue reference number
 * @property {String} ratingDecisionReferenceId - decision reference id
 */
/** Filter out ineligible contestable issues:
 * - remove issues more than one year past their decision date
 * - remove issues that are deferred
 * @prop {ContestableIssues} - Array of both eligible & ineligible contestable
 *  issues
 */
export const getEligibleContestableIssues = issues => {
  const today = moment().startOf('day');
  return (issues || []).filter(issue => {
    const {
      approxDecisionDate = '',
      ratingIssueSubjectText = '',
      description = '',
    } = issue?.attributes || {};

    const isDeferred = [ratingIssueSubjectText, description]
      .join(' ')
      .includes('deferred');
    const date = moment(approxDecisionDate);
    if (isDeferred || !date.isValid()) {
      return false;
    }
    return date.add(1, 'years').isAfter(today);
  });
};

/**
 * Combine issues values into one field
 * @param {ContestableIssue~Attributes} attributes
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
    .join(' - ')
    .substring(0, MAX_LENGTH.ISSUE_NAME);
  return replaceSubmittedData(result);
};

/**
 * @typedef ContestableIssue~SubmittableItem
 * @type {Object}
 * @property {String} issue - title of issue returned by createIssueName function
 * @property {String} decisionDate - decision date string (YYYY-MM-DD)
 * @property {String} disagreementArea - area of disagreement
 * @property {Number=} decisionIssueId - decision id
 * @property {String=} ratingIssueReferenceId - issue reference number
 * @property {String=} ratingDecisionReferenceId - decision reference id
 * @example
 * [{
    "type": "contestableIssue",
    "attributes": {
      // required
      "issue": "tinnitus - 10% - some longer description",
      "decisionDate": "1900-01-01",
      // optional
      "decisionIssueId": 1,
      "ratingIssueReferenceId": "2",
      "ratingDecisionReferenceId": "3"
    }
  }]
 */
/**
 * @typedef ContestableIssue~Submittable
 * @type {Array<Object>}
 * @property {ContestableIssue~SubmittableItem}
 */
/**
 * Get array of submittable contestable issues
 * @param {ContestableIssues}
 * @returns {ContestableIssue~Submittable}
 */
export const getContestableIssues = ({ contestableIssues }) =>
  contestableIssues.filter(issue => issue[SELECTED]).map(issue => {
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
        decisionDate: attr.approxDecisionDate,
      },
    );

    return {
      type: issue.type,
      attributes,
    };
  });

/**
 * @typedef AdditionalIssues
 * @type {Array<Object>}
 * @property {AdditionalIssue~Item}
 */
/**
 * @typedef AdditionalIssue~Item - user-added issues
 * @type {Object}
 * @property {String} issue - user entered issue name
 * @property {String} decisionDate - user entered decision date
 * @property {Boolean} 'view:selected' - user selected issue
 * @returns {ContestableIssue~Submittable}
 * @example
 *  [{
      "issue": "right shoulder",
      "decisionDate": "2010-01-06"
    }]
 */
/**
 * Combine included issues and additional issues
 * @param {FormData}
 * @returns {ContestableIssue~Submittable}
 */
export const addIncludedIssues = formData => {
  const issues = getContestableIssues(formData);
  return issues.concat(
    (formData.additionalIssues || []).reduce((issuesToAdd, issue) => {
      if (issue[SELECTED] && issue.issue && issue.decisionDate) {
        // match contestable issue pattern
        issuesToAdd.push({
          type: 'contestableIssue',
          attributes: {
            issue: replaceSubmittedData(issue.issue),
            decisionDate: issue.decisionDate,
          },
        });
      }
      return issuesToAdd;
    }, []),
  );
};

/**
 * Add area of disagreement
 * @param {ContestableIssue~Submittable} issues - selected & processed issues
 * @param {FormData} formData
 * @return {ContestableIssues~Submittable} issues with "disagreementArea" added
 */
export const addAreaOfDisagreement = (issues, { areaOfDisagreement } = {}) => {
  const keywords = {
    serviceConnection: () => SUBMITTED_DISAGREEMENTS.serviceConnection,
    effectiveDate: () => SUBMITTED_DISAGREEMENTS.effectiveDate,
    evaluation: () => SUBMITTED_DISAGREEMENTS.evaluation,
  };
  return issues.map((issue, index) => {
    const entry = areaOfDisagreement[index];
    const reasons = Object.entries(entry.disagreementOptions)
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
 * @typedef Evidence
 * @type {Array<Object>}
 * @property {Evidence~File}
 */
/**
 * @typedef Evidence~File - user-uploaded evidence files
 * @type {Object}
 * @property {String} name - uploaded file name
 * @property {String} confirmationCode - UUID returned by upload API
 * @property {Boolean} isEncrypted - (not currently used) flag indicating that
 *  the file _was_ an encrypted PDF, but was unencrypted after processing it
 *  with the user provided password (not yet implemented)
 */
/**
 * @typedef Evidence~Submittable
 * @type {Object}
 * @property {String} name - uploaded file name
 * @property {String} confirmationCode - UUID returned by upload API
 */
/**
 * Return processed array of file uploads
 * @param {FormData}
 * @returns {Evidence~Submittable[]}
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
 * Veteran~submittable
 * @property {Address~submittable} address
 * @property {Phone~submittable} phone
 * @property {String} emailAddressText
 * @property {Boolean} homeless
 */
/**
 * Address~submittable
 * @typedef {Object}
 * @property {String} addressLine1
 * @property {String} addressLine2
 * @property {String} addressLine3
 * @property {String} city
 * @property {String} stateCode
 * @property {String} zipCode5
 * @property {String} countryName
 * @property {String} internationalPostalCode
 */
/**
 * Phone~submittable
 * @typedef {Object}
 * @property {String} countryCode
 * @property {String} areaCode
 * @property {String} phoneNumber
 * @property {String} phoneNumberExt
 */
/**
 * Strip out extra profile home address data & rename zipCode to zipCode5
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */
export const getAddress = ({ veteran = {} } = {}) => {
  const truncate = (value, max) =>
    replaceSubmittedData(veteran.address?.[value] || '').substring(0, max);
  const internationalPostalCode = truncate(
    'internationalPostalCode',
    MAX_LENGTH.POSTAL_CODE,
  );
  return removeEmptyEntries({
    addressLine1: truncate('addressLine1', MAX_LENGTH.ADDRESS_LINE1),
    addressLine2: truncate('addressLine2', MAX_LENGTH.ADDRESS_LINE2),
    addressLine3: truncate('addressLine3', MAX_LENGTH.ADDRESS_LINE3),
    city: truncate('city', MAX_LENGTH.CITY),
    stateCode: veteran.address?.stateCode || '',
    zipCode5: internationalPostalCode
      ? '00000'
      : truncate('zipCode', MAX_LENGTH.ZIP_CODE5),
    countryName: veteran.address?.countryName || '',
    // countryCodeISO2: truncate('countryCodeIso2', MAX_LENGTH.COUNTRY), // v2
    internationalPostalCode,
  });
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
    countryCode: truncate('countryCode', MAX_LENGTH.COUNTRY_CODE),
    areaCode: truncate('areaCode', MAX_LENGTH.AREA_CODE),
    phoneNumber: truncate('phoneNumber', MAX_LENGTH.PHONE_NUMBER),
    phoneNumberExt: truncate('phoneNumberExt', MAX_LENGTH.PHONE_NUMBER_EXT),
  });
};

/**
 * Get user's current time zone
 * @returns {String}
 * @example 'America/Los_Angeles'
 */
export const getTimeZone = () =>
  // supports IE11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  Intl.DateTimeFormat().resolvedOptions().timeZone;
