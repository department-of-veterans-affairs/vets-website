import {
  SELECTED,
  CONFERENCE_TIMES_V1,
  CONFERENCE_TIMES_V2,
  MAX_ISSUE_NAME_LENGTH,
  MAX_DISAGREEMENT_REASON_LENGTH,
  SUBMITTED_DISAGREEMENTS,
} from '../constants';
import { apiVersion1 } from './helpers';

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

// We require the user to input a 10-digit number; assuming we get a 3-digit
// area code + 7 digit number. We're not yet supporting international numbers
export const getPhoneNumber = (phone = '') => ({
  countryCode: '1',
  areaCode: phone.substring(0, 3),
  phoneNumber: phone.substring(3),
  // Empty string/null are not permitted values
  // phoneNumberExt: '',
});

export const getRep = formData => {
  if (formData.informalConference !== 'rep') {
    return null;
  }
  const phoneNumber = formData?.informalConferenceRep?.phone;
  const phone = {
    countryCode: '1',
    areaCode: phoneNumber.substring(0, 3),
    phoneNumber: phoneNumber.substring(3),
  };
  if (apiVersion1(formData)) {
    return {
      name: formData?.informalConferenceRep?.name,
      phone,
    };
  }

  // Empty string/null are not permitted values
  return removeEmptyEntries({
    firstName: formData?.informalConferenceRep?.firstName,
    lastName: formData?.informalConferenceRep?.lastName,
    phone: removeEmptyEntries({
      ...phone,
      phoneNumberExt: formData.informalConferenceRep.extension || '',
    }),
    email: formData.informalConferenceRep.email || '',
  });
};

// schema v1
export const getConferenceTimes = (formData = {}) => {
  const { informalConferenceTimes = [] } = formData;
  const xRef = Object.keys(CONFERENCE_TIMES_V1).reduce(
    (timesAndApi, time) => ({
      ...timesAndApi,
      [time]: CONFERENCE_TIMES_V1[time].submit,
    }),
    {},
  );
  return ['time1', 'time2'].reduce((setTimes, key) => {
    const value = informalConferenceTimes[key] || '';
    if (value) {
      setTimes.push(xRef[value]);
    }
    return setTimes;
  }, []);
};

// schema v2
export const getConferenceTime = (formData = {}) => {
  const { informalConferenceTime = '' } = formData;
  return CONFERENCE_TIMES_V2[informalConferenceTime]?.submit || '';
};

export const getTimeZone = () =>
  // supports IE11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  Intl.DateTimeFormat().resolvedOptions().timeZone;

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
  return [
    ratingIssueSubjectText,
    `${ratingIssuePercentNumber || '0'}%`,
    description,
  ]
    .filter(part => part)
    .join(' - ')
    .substring(0, MAX_ISSUE_NAME_LENGTH);
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
export const getContestedIssues = ({ contestedIssues = [] }) =>
  contestedIssues.filter(issue => issue[SELECTED]).map(issue => {
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
  const issues = getContestedIssues(formData);
  if (formData.hlrV2) {
    return issues.concat(
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
  }
  return issues;
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
    other: disagreementOptions => disagreementOptions.otherEntry,
  };
  return issues.map((issue, index) => {
    const entry = areaOfDisagreement[index];
    const reasons = Object.entries(entry.disagreementOptions)
      .map(([key, value]) => value && keywords[key](entry))
      .filter(Boolean);
    return {
      ...issue,
      attributes: {
        ...issue.attributes,
        disagreementArea: reasons
          .join(',')
          .substring(0, MAX_DISAGREEMENT_REASON_LENGTH), // max length in schema
      },
    };
  });
};

export const getContact = ({ informalConference }) => {
  if (informalConference === 'rep') {
    return 'representative';
  }
  if (informalConference === 'me') {
    return 'veteran';
  }
  return '';
};

/**
 * Veteran~submittable
 * @property {Address~submittable} address
 * @property {Phone~submittable} phone
 * @property {String} emailAddressText
 * @property {Boolean} homeless
 */
/**
 * Address~submittableV1
 * @typedef {Object}
 * @property {String} zipCode5
 */
/**
 * Address~submittableV2
 * @typedef {Object}
 * @property {String} addressLine1
 * @property {String} addressLine2
 * @property {String} addressLine3
 * @property {String} city
 * @property {String} stateCode
 * @property {String} zipCode5
 * @property {String} countryCodeISO2
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
 * FormData
 * @typedef {Object}
 * @property {Veteran} veteran - Veteran formData object
 * @property {String} zipCode5 - zip code saved in v1
 * @property {Boolean} hlrV2 - HLR v2 feature flag, true for v2
 */
/**
 * Strip out extra profile home address data & rename zipCode to zipCode5
 * @param {FormData} formData
 * @returns {Address~submittableV1|Address~submittableV2}
 */
export const getAddress = formData => {
  const { veteran = {}, zipCode5 = '' } = formData || {};
  if (apiVersion1(formData)) {
    return { zipCode5: zipCode5 || '00000' };
  }
  return removeEmptyEntries({
    addressLine1: veteran.address?.addressLine1 || '',
    addressLine2: veteran.address?.addressLine2 || '',
    addressLine3: veteran.address?.addressLine3 || '',
    city: veteran.address?.city || '',
    stateCode: veteran.address?.stateCode || '',
    countryCodeISO2: veteran.address?.countryCodeIso2 || '',
    // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json#L145
    zipCode5: veteran.address?.zipCode || '',
    internationalPostalCode: veteran.address?.internationalPostalCode || '',
  });
};

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
