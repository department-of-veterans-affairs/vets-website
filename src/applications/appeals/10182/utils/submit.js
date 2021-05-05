import moment from 'moment';

import { SELECTED } from '../constants';

/**
 * @typedef FormData
 * @type {Object<Object>}
 * @property {Veteran} veteran - data from prefill & profile
 * @property {ContestableIssues} contestableIssues - issues loaded from API
 * @property {AdditionaIssues} additionalIssues - issues entered by Veteran
 * @property {Evidence} evidence - Evidence uploaded by Veteran
 * @property {Boolean} homeless - homeless choice
 * @property {Boolean} view:hasRep - Has a VSO choice
 * @property {String} representativesName - Veteran entered VSO name
 * @property {String} boardReviewOption - Veteran selected review option - enum
 *   to "direct_review", "evidence_submission" or "hearing"
 * @property {String} hearingTypePreference - Vetera selected hearing type -
 *   enum to "virtual_hearing", "video_conference" or "central_office"
 * @property {Boolean} socOptIn - check box indicating the Veteran has opted in
 *   to the new appeal process
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
export const getIssueName = ({ attributes } = {}) => {
  const {
    ratingIssueSubjectText,
    ratingIssuePercentNumber,
    description,
  } = attributes;
  return [
    ratingIssueSubjectText,
    `${ratingIssuePercentNumber || '0'}%`,
    description,
  ]
    .filter(part => part)
    .join(' - ')
    .substring(0, 255);
};

/**
 * @typedef ContestableIssue~SubmittableItem
 * @type {Object}
 * @property {String} issue - title of issue returned by getIssueName function
 * @property {String} decisionDate - decision date string (YYYY-MM-DD)
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
        issue: getIssueName(issue),
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
export const addIncludedIssues = formData =>
  getContestableIssues(formData).concat(
    (formData.additionalIssues || []).reduce((issuesToAdd, issue) => {
      if (issue[SELECTED] && issue.issue && issue.decisionDate) {
        // match contested issue pattern
        issuesToAdd.push({
          type: 'contestableIssue',
          attributes: {
            issue: issue.issue,
            decisionDate: issue.decisionDate,
          },
        });
      }
      return issuesToAdd;
    }, []),
  );

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
  formData['view:additionalEvidence']
    ? formData.evidence.map(({ name, confirmationCode }) => ({
        name,
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
 * @property {String} representativesName
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
export const getAddress = ({ veteran = {} } = {}) =>
  removeEmptyEntries({
    addressLine1: veteran.address?.addressLine1 || '',
    addressLine2: veteran.address?.addressLine2 || '',
    addressLine3: veteran.address?.addressLine3 || '',
    city: veteran.address?.city || '',
    stateCode: veteran.address?.stateCode || '',
    zipCode5: veteran.address?.zipCode || '',
    countryName: veteran.address?.countryName || '',
    internationalPostalCode: veteran.address?.internationalPostalCode || '',
  });

/**
 * Strip out extra profile phone data
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */
export const getPhone = ({ veteran = {} } = {}) =>
  removeEmptyEntries({
    countryCode: veteran.phone?.countryCode || '',
    areaCode: veteran.phone?.areaCode || '',
    phoneNumber: veteran.phone?.phoneNumber || '',
    phoneNumberExt: veteran.phone?.phoneNumberExt || '',
  });

/**
 * Get representative name entered by Veteran
 * @param {FormData}
 * @returns {String} Rep name with max length of 120 characters
 */
export const getRepName = formData =>
  formData['view:hasRep']
    ? (formData.representativesName || '').substring(0, 120)
    : '';

/**
 * Get user's current time zone
 * @returns {String}
 * @example 'America/Los_Angeles'
 */
export const getTimeZone = () =>
  // supports IE11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  Intl.DateTimeFormat().resolvedOptions().timeZone;
