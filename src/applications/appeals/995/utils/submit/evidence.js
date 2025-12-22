import { buildPrivateString } from '../../validations/evidence';
import {
  getVAEvidence,
  getOtherEvidence,
  getPrivateEvidence,
} from '../form-data-retrieval';
import { getFacilityType } from './facilities';
import '../../../shared/definitions';
import { fixDateFormat } from '../../../shared/utils/dates';
import { HAS_PRIVATE_LIMITATION } from '../../constants';

/**
 * @typedef VALocation
 * @type {Object}
 * @property {String} locationAndName - VA or private medical records name
 * @property {Array<String>} issues - list of selected issues
 * @property {String} treatmentDate - YYYY-MM
 * @property {Boolean} noDate - no date provided
 */
/**
 * Get treatment date and noData boolean, then return a full date (YYYY-MM-DD)
 * with DD set to 01 for date comparisons; Currently, if the treatment date
 * appears to be invalid, or noDate is set, we return a made up date until we
 * know what Lighthouse's final API looks like
 * @param {VALocation} location
 * @returns {String} YYYY-MM-DD (including day for date comparisons)
 */
export const getTreatmentDate = location => {
  const { treatmentDate = '', noDate } = location;
  const yearRegex = /^(19[2-9][6-9]|20[0-1][0-9]|202[0-5])$/;
  const isValidYear = yearRegex.test(treatmentDate);

  if (noDate || (treatmentDate.length < 7 && !isValidYear)) {
    return '';
  }

  const date = `${treatmentDate}-01`;

  return fixDateFormat(date, treatmentDate.length === 4);
};

export const dedupeVALocations = locations => {
  const uniqueLocations = new Map();

  return locations.filter(item => {
    // Sometimes items are wrapped with { attributes: { ...contents } }
    const itemDetails = item?.locationAndName ? item : item.attributes;

    // Create a unique key by stringifying the object
    // Sort the issues array to ensure consistent comparison
    const normalizedItem = {
      ...itemDetails,
      issues: [...itemDetails.issues].sort(),
    };

    const key = JSON.stringify(normalizedItem);

    // If we haven't seen this key before, keep it
    if (!uniqueLocations.has(key)) {
      uniqueLocations.set(key, true);
      return true;
    }

    return false;
  });
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
            }
          ],
          noTreatmentDates: false
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

  const types = getFacilityType(formData);

  if (Object.keys(types).length) {
    evidenceSubmission.treatmentLocations = types.treatmentLocations;
    evidenceSubmission.treatmentLocationOther = types.treatmentLocationOther;
  }

  const locations = getVAEvidence(formData);

  if (locations.length) {
    evidenceSubmission.evidenceType.push('retrieval');

    const uniqueVALocations = dedupeVALocations(formData.locations);

    evidenceSubmission.retrieveFrom = uniqueVALocations.map(location => {
      // Transformation of `treatmentDate` (YYYY-MM) to `evidenceDates`
      // range { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
      const from = getTreatmentDate(location);
      const to = getTreatmentDate(location);

      const entry = {
        type: 'retrievalEvidence',
        attributes: {
          // We're not including the issues here - it's only in the form to
          // make the UX consistent with the private records location pages
          locationAndName: location.locationAndName,
          // Lighthouse wants between 1 and 4 evidenceDates, but we're only
          // providing one because of UX considerations
          evidenceDates: [{ startDate: from, endDate: to }],
        },
      };

      // Because of Lighthouse's schema, don't include `evidenceDates` if no
      // date is provided
      // Only startDate (from) is required, remove evidenceDates if
      // undefined
      const noTreatmentDates = location.noDate || !from;

      if (noTreatmentDates) {
        delete entry.attributes.evidenceDates;
      }

      // noDate can be undefined; so fallback to false due to LH schema
      entry.attributes.noTreatmentDates = noTreatmentDates || false;

      return entry;
    });
  }

  // additionalDocuments added in submit-transformer
  if (getOtherEvidence(formData).length) {
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

export const getForm4142 = formData => {
  const facilities = getPrivateEvidence(formData);
  if (facilities.length === 0) {
    return null;
  }

  const { limitedConsent, privacyAgreementAccepted = true } = formData;
  const limitedConsentResponse = formData?.[HAS_PRIVATE_LIMITATION]
    ? limitedConsent
    : '';

  const providerFacility = facilities.reduce((list, facility) => {
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
  }, []);

  return {
    privacyAgreementAccepted,
    limitedConsent: limitedConsentResponse,
    providerFacility,
  };
};
