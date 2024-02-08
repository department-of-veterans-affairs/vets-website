import {
  CLAIMANT_TYPES,
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  PRIMARY_PHONE,
} from '../constants';
import {
  hasHomeAndMobilePhone,
  hasHomePhone,
  hasMobilePhone,
} from './contactInfo';
import {
  buildPrivateString,
  buildVaLocationString,
} from '../validations/evidence';

import { MAX_LENGTH } from '../../shared/constants';
import '../../shared/definitions';
import {
  fixDateFormat,
  replaceSubmittedData,
} from '../../shared/utils/replace';
import { removeEmptyEntries } from '../../shared/utils/submit';

export const getTimeZone = () =>
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * @typedef ClaimantData
 * @type {Object}
 * @property {String} claimantType - Phase 1 only supports "veteran"
 * @property {String} claimantTypeOtherValue - Populated if ClaimantType is "other"
 */
/**
 * Get claimant type data
 * @param {String} claimantType
 * @param {String} claimantTypeOtherValue
 * @returns ClaimantData
 */
export const getClaimantData = ({
  claimantType = '',
  claimantTypeOtherValue = '',
}) => {
  const result = {
    // Phase 1: No claimant type question, so we default to "veteran"
    claimantType: claimantType || CLAIMANT_TYPES[0],
  };

  if (result.claimantType === 'other' && claimantTypeOtherValue) {
    result.claimantTypeOtherValue = claimantTypeOtherValue.substring(
      0,
      MAX_LENGTH.SC_CLAIMANT_OTHER,
    );
  }
  return result;
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
  // user profile provides "Iso2", whereas Lighthouse wants "ISO2"
  const countryCodeISO2 = truncate(
    'countryCodeIso2',
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
    countryCodeISO2 !== 'US'
      ? '00000'
      : truncate('zipCode', MAX_LENGTH.ZIP_CODE5);
  return removeEmptyEntries({
    // Long addresses will overflow to an attachment page
    addressLine1: truncate('addressLine1', MAX_LENGTH.ADDRESS_LINE1),
    addressLine2: truncate('addressLine2', MAX_LENGTH.ADDRESS_LINE2),
    addressLine3: truncate('addressLine3', MAX_LENGTH.ADDRESS_LINE3),
    city: truncate('city', MAX_LENGTH.CITY),
    // stateCode is from enum
    stateCode: truncate('stateCode'),
    countryCodeISO2,
    // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/shared/v0/address.json#L34
    zipCode5,
    internationalPostalCode,
  });
};

/**
 * Strip out extra profile phone data
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */

// NOTE: This one stays in 995 because 995 includes a mobile phone number while 996 and 10182 do not
export const getPhone = formData => {
  const data = formData || {};
  const { veteran = {} } = data;
  const primary = data[PRIMARY_PHONE] || '';
  // we shouldn't ever get to this point without a home or mobile phone
  let phone;
  if (hasHomeAndMobilePhone(data) && primary) {
    phone = `${primary}Phone`;
  } else if (hasMobilePhone(data)) {
    phone = 'mobilePhone';
  } else if (hasHomePhone(data)) {
    phone = 'homePhone';
  }

  const truncate = (value, max) =>
    replaceSubmittedData(veteran[phone]?.[value] || '').substring(0, max);
  return phone
    ? removeEmptyEntries({
        countryCode: truncate('countryCode', MAX_LENGTH.PHONE_COUNTRY_CODE),
        areaCode: truncate('areaCode', MAX_LENGTH.PHONE_AREA_CODE),
        phoneNumber: truncate('phoneNumber', MAX_LENGTH.PHONE_NUMBER),
        phoneNumberExt: truncate('phoneNumberExt', MAX_LENGTH.PHONE_NUMBER_EXT),
      })
    : {};
};

export const hasDuplicateLocation = (list, currentLocation) =>
  !!list.find(location => {
    const { locationAndName, evidenceDates } = location.attributes;
    return (
      buildVaLocationString(
        {
          locationAndName,
          evidenceDates: {
            from: evidenceDates[0].startDate,
            to: evidenceDates[0].endDate,
          },
        },
        ',',
        { includeIssues: false },
      ) ===
      buildVaLocationString(currentLocation, ',', { includeIssues: false })
    );
  });

/**
 * Truncate long email addresses
 * @param {Veteran} veteran - Veteran formData object
 * @returns {String} submittable email address
 */
export const getEmail = formData => {
  const { veteran } = formData || {};
  return (veteran?.email || '').substring(0, MAX_LENGTH.EMAIL);
};

/**
 * @typedef EvidenceSubmission
 * @type {Array<Object>}
 * @property {EvidenceSubmissionUpload|EvidenceSubmissionRetrieval}
 */
/**
 * @typedef EvidenceSubmissionUpload - uploaded evidence
 * @type {Object}
 * @property {String} evidenceType - enum: 'upload'
 * @example [{ "evidenceType": "upload" }]
 */
/**
 * @typedef EvidenceSubmissionNone - No evidence
 * @type {Object}
 * @property {String} evidenceType - enum: 'none'
 * @example [{ "evidenceType": "none" }]
 */
/**
 * @typedef EvidenceSubmissionEvidenceDates
 * @type {Array<Object>}
 * @property {string} startDate (YYYY-MM-DD)
 * @property {string} endDate (YYYY-MM-DD)
 */
/**
 * @typedef EvidenceSubmissionRetrieval - retrieve evidence
 * @type {Object}
 * @property {String} evidenceType - enum: 'retrieval'
 * @property {String} locationAndName - VA or private medical records name
 * @property {EvidenceSubmissionEvidenceDates} - date range
 * @example
  "evidenceSubmission": [{
    "evidenceType": ["retrieval", "upload"],
    "retrieveFrom": [
      {
        "type": "retrievalEvidence",
        "attributes": {
          "locationAndName": "string max 255 characters",
          // max 4 evidence dates
          "evidenceDates": [
            {
              "startDate": "2010-01-06",
              "endDate": "2010-01-07"
            },
            {
              "startDate": "2010-04-15",
              "endDate": "2010-04-18"
            }
          ]
        }
      }
    ]
  }]
 */
/**
 * Get evidence
 * @param {Object} formData - full form data
 */
export const getEvidence = formData => {
  const evidenceSubmission = {
    evidenceType: [],
  };
  // Add VA evidence data
  if (formData[EVIDENCE_VA] && formData.locations?.length) {
    evidenceSubmission.evidenceType.push('retrieval');
    evidenceSubmission.retrieveFrom = formData.locations.reduce(
      (list, location) => {
        if (!hasDuplicateLocation(list, location)) {
          list.push({
            type: 'retrievalEvidence',
            attributes: {
              // we're not including the issues here - it's only in the form to make
              // the UX consistent with the private records location pages
              locationAndName: location.locationAndName,
              // Lighthouse wants between 1 and 4 evidenceDates, but we're only
              // providing one
              evidenceDates: [
                {
                  startDate: fixDateFormat(location.evidenceDates.from),
                  endDate: fixDateFormat(location.evidenceDates.to),
                },
              ],
            },
          });
        }
        return list;
      },
      [],
    );
  }
  // additionalDocuments added in submit-transformer
  if (formData[EVIDENCE_OTHER] && formData.additionalDocuments.length) {
    evidenceSubmission.evidenceType.push('upload');
  }
  // Lighthouse wants us pass an evidence type of "none" if we're not submitting
  // evidence
  if (evidenceSubmission.evidenceType.length === 0) {
    evidenceSubmission.evidenceType.push('none');
  }
  return {
    form5103Acknowledged: formData.form5103Acknowledged,
    evidenceSubmission,
  };
};

// Backend still works if we pass along duplicate issues
export const hasDuplicateFacility = (list, currentFacility) => {
  const current = buildPrivateString(currentFacility, ',');
  return !!list.find(
    facility =>
      buildPrivateString(
        { ...facility, treatmentDateRange: facility.treatmentDateRange[0] },
        ',',
      ) === current,
  );
};

/**
 * The backend is filling out form 4142/4142a (March 2021) which doesn't include
 * the conditions (issues) that were treated. These are asked for in the newer
 * 4142/4142a (July 2021)
 */
export const getForm4142 = formData => {
  const { privacyAgreementAccepted = true, limitedConsent = '' } = formData;
  const providerFacility = (formData?.providerFacility || []).reduce(
    (list, facility) => {
      if (!hasDuplicateFacility(list, facility)) {
        list.push({
          ...facility,
          // 4142 is expecting an array
          treatmentDateRange: [
            {
              from: fixDateFormat(facility.treatmentDateRange?.from),
              to: fixDateFormat(facility.treatmentDateRange?.to),
            },
          ],
        });
      }
      return list;
    },
    [],
  );
  return formData[EVIDENCE_PRIVATE]
    ? {
        privacyAgreementAccepted,
        limitedConsent,
        providerFacility,
      }
    : null;
};
