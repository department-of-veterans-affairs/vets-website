import { HLR_MAX_LENGTH, CONFERENCE_TIMES_V2 } from '../constants';

import {
  replaceSubmittedData,
  fixDateFormat,
} from '../../shared/utils/replace';
import { returnUniqueIssues } from '../../shared/utils/issues';
import '../../shared/definitions';
import {
  SELECTED,
  MAX_LENGTH,
  SUBMITTED_DISAGREEMENTS,
} from '../../shared/constants';

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
 * Add area of disagreement
 * @param {ContestableIssueSubmittable} issues - selected & processed issues
 * @param {FormData} formData
 * @return {ContestableIssuesSubmittable} issues with "disagreementArea" added
 */
export const addAreaOfDisagreement = (issues, { areaOfDisagreement } = {}) => {
  const keywords = {
    serviceConnection: () => SUBMITTED_DISAGREEMENTS.serviceConnection,
    effectiveDate: () => SUBMITTED_DISAGREEMENTS.effectiveDate,
    evaluation: () => SUBMITTED_DISAGREEMENTS.evaluation,
  };
  if (!areaOfDisagreement?.length) {
    return issues;
  }
  return issues.map((issue, index) => {
    const entry = areaOfDisagreement[index];
    const reasons = Object.entries(entry.disagreementOptions)
      .map(([key, value]) => value && keywords[key](entry))
      .concat((entry?.otherEntry || '').trim())
      .filter(Boolean);
    const disagreementArea = replaceSubmittedData(
      // max length in schema
      reasons.join(',').substring(0, HLR_MAX_LENGTH.DISAGREEMENT_REASON),
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
 * FormData
 * @typedef {Object}
 * @property {Veteran} veteran - Veteran formData object
 */
/**
 * Strip out extra profile home address data & rename zipCode to zipCode5
 * @param {FormData} formData
 * @returns {AddressSubmittableV2}
 */
export const getAddress = formData => {
  const { veteran = {} } = formData || {};
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
    countryCodeISO2: truncate('countryCodeIso2', MAX_LENGTH.COUNTRY),
    // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json#L145
    zipCode5: internationalPostalCode
      ? '00000'
      : truncate('zipCode', MAX_LENGTH.ZIP_CODE5),
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
