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
import { removeEmptyEntries } from '../../../shared/utils/submit';

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
export const getTreatmentDate = (type, showNewFormContent, location) => {
  const { treatmentDate = '', evidenceDates = {}, noDate } = location;
  if (showNewFormContent && noDate) {
    return '';
  }

  return showNewFormContent && treatmentDate.length === 7
    ? `${treatmentDate}-01`
    : evidenceDates[type] || '';
};

export const hasDuplicateLocation = (
  list,
  currentLocation,
  newForm = false,
) => {
  const currentString = buildVaLocationString({
    data: {
      ...currentLocation,
      evidenceDates: {
        from: getTreatmentDate('from', newForm, currentLocation),
        to: getTreatmentDate('to', newForm, currentLocation),
      },
    },
    joiner: ',',
    includeIssues: false,
    newForm,
  });

  return list.some(location => {
    const data = {
      ...location.attributes,
      evidenceDates: location.attributes.evidenceDates?.[0] || {},
      noDate: location.attributes.noTreatmentDates,
    };

    const locationString = buildVaLocationString({
      data: {
        ...data,
        evidenceDates: {
          from: getTreatmentDate('startDate', newForm, data),
          to: getTreatmentDate('endDate', newForm, data),
        },
      },
      joiner: ',',
      includeIssues: false,
      wrapped: true,
      newForm,
    });

    return locationString === currentString;
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
            },
            {
              "startDate": "2010-04-15",
              "endDate": "2010-04-18"
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
          const from = getTreatmentDate('from', showNewFormContent, location);
          const to = getTreatmentDate('to', showNewFormContent, location);
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
                removeEmptyEntries({
                  startDate: fixDateFormat(from),
                  endDate: fixDateFormat(to),
                }),
              ],
              noTreatmentDates: location.noDate,
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
