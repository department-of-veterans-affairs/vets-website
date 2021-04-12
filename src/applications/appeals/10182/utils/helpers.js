import { parse, startOfDay, add, isAfter } from 'date-fns';

// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SELECTED } from '../constants';
import { isValidDate } from '../validations';

export const noticeOfDisagreementFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form10182Nod];

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
  const today = startOfDay(new Date());
  return (issues || []).filter(issue => {
    const {
      approxDecisionDate = '',
      ratingIssueSubjectText = '',
      description = '',
    } = issue?.attributes || {};

    const isDeferred = [ratingIssueSubjectText, description]
      .join(' ')
      .includes('deferred');
    const date = parse(approxDecisionDate, 'yyyy-MM-dd', new Date());
    if (isDeferred || !isValidDate(date)) {
      return false;
    }
    return isAfter(add(date, { years: 1 }), today);
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
export const getContestedIssues = ({ contestedIssues }) =>
  contestedIssues.filter(issue => issue[SELECTED]).map(issue => {
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
      // type: "contestableIssues"
      type: issue.type,
      attributes,
    };
  });

/**
 * @typedef FormData
 * @type {Object<Object>}
 * @property {ContestableIssues}
 * @property {AdditionaIssues}
 * @property {*} Unused properties
 */
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
  getContestedIssues(formData).concat(
    (formData.additionalIssues || []).reduce((issuesToAdd, issue) => {
      if (issue.issue && issue.decisionDate) {
        // match contested issue pattern
        issuesToAdd.push({
          type: 'contestableIssue',
          attributes: issue,
        });
      }
      return issuesToAdd;
    }, []),
  );

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
 * Veteran
 * @property {String} ssnLastFour
 * @property {String} vaFileLastFour
 * @property {Address~submittable} address
 * @property {Phone~submittable} phone
 * @property {String} email
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
 * @param {Object} veteran - Veteran formData object
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
 * @param {Object} veteran - Veteran formData object
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
 * Get user's current time zone
 * @returns {String}
 * @example 'America/Los_Angeles'
 */
export const getTimeZone = () =>
  // supports IE11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  Intl.DateTimeFormat().resolvedOptions().timeZone;
