import {
  SELECTED,
  MAX_LENGTH,
  CLAIMANT_TYPES,
  PRIMARY_PHONE,
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_OTHER,
} from '../constants';
import {
  hasHomeAndMobilePhone,
  hasHomePhone,
  hasMobilePhone,
} from './contactInfo';
import {
  replaceSubmittedData,
  fixDateFormat,
} from '../../shared/utils/replace';
import {
  buildVaLocationString,
  buildPrivateString,
} from '../validations/evidence';
import { returnUniqueIssues } from '../../shared/utils/issues';
import '../../shared/definitions';

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
    result.claimantTypeOtherValue = (claimantTypeOtherValue || '').substring(
      0,
      MAX_LENGTH.CLAIMANT_OTHER,
    );
  }
  return result;
};

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
    // Long addresses will overflow to an attachment page
    addressLine1: truncate('addressLine1', MAX_LENGTH.ADDRESS_LINE1),
    addressLine2: truncate('addressLine2', MAX_LENGTH.ADDRESS_LINE2),
    addressLine3: truncate('addressLine3', MAX_LENGTH.ADDRESS_LINE3),
    city: truncate('city', MAX_LENGTH.CITY),
    // stateCode is from enum
    stateCode: truncate('stateCode'),
    // user profile provides "Iso2", whereas Lighthouse wants "ISO2"
    countryCodeISO2: truncate('countryCodeIso2', MAX_LENGTH.ADDRESS_COUNTRY),
    // zipCode5 is always required, set to 00000 for international codes
    // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200995.json#L28
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
  if (formData[EVIDENCE_VA] && formData.locations.length) {
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
