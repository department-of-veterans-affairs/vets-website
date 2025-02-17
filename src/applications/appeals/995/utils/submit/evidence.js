import { EVIDENCE_LIMIT } from '../../constants';

import {
  buildPrivateString,
  buildVaLocationString,
} from '../../validations/evidence';

import { showScNewForm } from '../toggle';
import {
  getVAEvidence,
  getOtherEvidence,
  getPrivateEvidence,
} from '../evidence';
import { getFacilityType } from './facilities';

import '../../../shared/definitions';
import { fixDateFormat } from '../../../shared/utils/replace';

export const TEMP_DATE = '2006-06-06';
/**
 * @typedef VALocation
 * @type {Object}
 * @property {String} locationAndName - VA or private medical records name
 * @property {Array<String>} issues - list of selected issues
 * @property {String} treatmentDate - YYYY-MM (new form)
 * @property {Boolean} noDate - no date provided (new form)
 * @property {Object} evidenceDates - date range (current form)
 * @property {String} evidenceDates.from - YYYY-MM-DD
 * @property {String} evidenceDates.to - YYYY-MM-DD
 */
/**
 * Get treatment date and noData boolean, then return a full date (YYYY-MM-DD)
 * with DD set to 01 for date comparisons; Currently, if the treatment date
 * appears to be invalid, or noDate is set, we return a made up date until we
 * know what Lighthouse's final API looks like
 * @param {VALocation} location
 * @returns {String} YYYY-MM-DD (including day for date comparisons)
 */
export const getTreatmentDate = ({ treatmentDate = '', noDate } = {}) => {
  // return a made up date until we know what the final API looks like
  return !noDate && treatmentDate.length === 7
    ? fixDateFormat(`${treatmentDate}-01`)
    : TEMP_DATE; // change this once we know the final API
};

export const hasDuplicateLocation = (list, currentLocation, newForm = false) =>
  !!list.find(location => {
    const { locationAndName, evidenceDates } = location.attributes;
    return (
      buildVaLocationString(
        {
          locationAndName,
          evidenceDates: newForm
            ? {}
            : {
                from: evidenceDates?.[0]?.startDate,
                to: evidenceDates?.[0]?.endDate,
              },
          treatmentDate: newForm ? getTreatmentDate(location.attributes) : '',
        },
        ',',
        { includeIssues: false },
      ) ===
      buildVaLocationString(
        {
          locationAndName: currentLocation.locationAndName,
          evidenceDates: newForm
            ? {}
            : {
                from: currentLocation.evidenceDates?.from,
                to: currentLocation.evidenceDates?.to,
              },
          treatmentDate: newForm ? getTreatmentDate(currentLocation) : '',
        },
        ',',
        { includeIssues: false },
      )
    );
  });

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
  const showNewFormContent = showScNewForm(formData);
  // Add VA evidence data

  if (showNewFormContent) {
    const types = getFacilityType(formData);
    if (Object.keys(types).length) {
      evidenceSubmission.treatmentLocations = types.treatmentLocations;
      evidenceSubmission.treatmentLocationOther = types.treatmentLocationOther;
    }
  }

  const locations = getVAEvidence(formData);
  if (locations.length) {
    evidenceSubmission.evidenceType.push('retrieval');
    evidenceSubmission.retrieveFrom = formData.locations.reduce(
      (list, location) => {
        if (!hasDuplicateLocation(list, location, showNewFormContent)) {
          // Temporary transformation of `treatmentDate` (YYYY-MM) to
          // `evidenceDates` range { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
          const from = showNewFormContent
            ? getTreatmentDate(location)
            : location.evidenceDates?.from;
          const to = showNewFormContent
            ? getTreatmentDate(location)
            : location.evidenceDates?.to;
          list.push({
            type: 'retrievalEvidence',
            attributes: {
              // We're not including the issues here - it's only in the form to
              // make the UX consistent with the private records location pages
              locationAndName: location.locationAndName,
              // Lighthouse wants between 1 and 4 evidenceDates, but we're only
              // providing one; with the new form, these dates will not be
              // required. Leaving this as is until LH provides the new API
              evidenceDates: [
                {
                  startDate: fixDateFormat(from),
                  endDate: fixDateFormat(to),
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

/**
 * The backend is filling out form 4142/4142a (March 2021) which doesn't include
 * the conditions (issues) that were treated. These are asked for in the newer
 * 4142/4142a (July 2021)
 */
export const getForm4142 = formData => {
  const facilities = getPrivateEvidence(formData);
  if (facilities.length === 0) {
    return null;
  }

  const { privacyAgreementAccepted = true } = formData;
  let { limitedConsent } = formData;

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

  if (showScNewForm(formData)) {
    // submit limitation based on yes/no question
    limitedConsent = formData[EVIDENCE_LIMIT] ? limitedConsent : '';
  }

  return {
    privacyAgreementAccepted,
    limitedConsent,
    providerFacility,
  };
};
