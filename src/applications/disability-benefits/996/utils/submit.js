import {
  SELECTED,
  CONFERENCE_TIMES_V1,
  CONFERENCE_TIMES_V2,
} from '../constants';

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
  country: '1',
  areaCode: phone.substring(0, 3),
  phoneNumber: phone.substring(3),
  // Empty string/null are not permitted values
  // phoneNumberExt: '',
});

export const getRep = (formData, version) => {
  if (version === 1) {
    return formData.informalConference === 'rep'
      ? {
          name: formData?.informalConferenceRep?.name,
          phone: getPhoneNumber(formData?.informalConferenceRep?.phone),
        }
      : null;
  }
  return formData.informalConference === 'rep'
    ? {
        firstName: formData?.informalConferenceRep?.firstName,
        lastName: formData?.informalConferenceRep?.lastName,
        phone: getPhoneNumber(formData?.informalConferenceRep?.phone),
      }
    : null;
};

export const getConferenceTimes = (
  { informalConferenceTimes = [] },
  version,
) => {
  const times = version === 1 ? CONFERENCE_TIMES_V1 : CONFERENCE_TIMES_V2;
  const xRef = Object.keys(times).reduce(
    (timesAndApi, time) => ({
      ...timesAndApi,
      [time]: times[time].submit,
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
    .substring(0, 140);
};

/* submitted contested issue format
[{
"type": "contestableIssue",
"attributes": {
  "issue": "tinnitus - 10% - some longer description",
  "decisionDate": "1900-01-01",
  "decisionIssueId": 1,
  "ratingIssueReferenceId": "2",
  "ratingDecisionReferenceId": "3"
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
 * Address~submittable
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
 * Strip out extra profile home address data & rename zipCode to zipCode5
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */
export const getAddress = ({ veteran = {}, zipCode5 = '' } = {}) =>
  removeEmptyEntries({
    addressLine1: veteran.address?.addressLine1 || '',
    addressLine2: veteran.address?.addressLine2 || '',
    addressLine3: veteran.address?.addressLine3 || '',
    city: veteran.address?.city || '',
    stateCode: veteran.address?.stateCode || '',
    countryCodeISO2: veteran.address?.countryCodeIso2 || '',
    // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json#L145
    zipCode5: zipCode5 || veteran.address?.zipCode || '00000',
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
