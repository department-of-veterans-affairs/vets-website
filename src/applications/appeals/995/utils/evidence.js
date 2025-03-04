import {
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_LIMIT,
  EVIDENCE_OTHER,
} from '../constants';

import { getIssueName, getSelected } from '../../shared/utils/issues';
import { showScNewForm, checkRedirect } from './toggle';

export const hasVAEvidence = formData => formData?.[EVIDENCE_VA];
export const hasPrivateEvidence = formData => formData?.[EVIDENCE_PRIVATE];
export const hasPrivateLimitation = formData =>
  showScNewForm(formData) &&
  hasPrivateEvidence(formData) &&
  formData?.[EVIDENCE_LIMIT];
export const hasNewPrivateLimitation = formData =>
  showScNewForm(formData) && hasPrivateEvidence(formData);
export const hasOriginalPrivateLimitation = formData =>
  !showScNewForm(formData) && hasPrivateEvidence(formData);
export const hasOtherEvidence = formData => formData?.[EVIDENCE_OTHER];

export const getVAEvidence = formData =>
  (hasVAEvidence(formData) && formData?.locations) || [];
export const getPrivateEvidence = formData =>
  (hasPrivateEvidence(formData) && formData?.providerFacility) || [];
export const getOtherEvidence = formData =>
  (hasOtherEvidence(formData) && formData?.additionalDocuments) || [];

export const hasErrors = errors =>
  Object.values(errors).filter(err => (Array.isArray(err) ? err.length : err))
    .length;

export const getIndex = (data, testingIndex, testSearch) => {
  // get index from url '/{path}?index={index}' or testingIndex
  const searchIndex = new URLSearchParams(testSearch || window.location.search);
  let index = parseInt(searchIndex.get('index') || testingIndex || '0', 10);
  if (Number.isNaN(index)) {
    index = 0;
  } else if (index > data.length) {
    index = data.length;
  }
  return index;
};

// Update evidence issues if they change
export const evidenceNeedsUpdating = formData => {
  let needsUpdate = false;
  const selectedIssues = getSelected(formData).map(getIssueName);
  const iterator = ({ issues }) =>
    (issues || []).every(issue => selectedIssues.includes(issue));

  const locations = getVAEvidence(formData);
  const facility = getPrivateEvidence(formData);
  if (locations.length > 0) {
    needsUpdate = !locations.every(iterator);
  }
  if (!needsUpdate && facility.length > 0) {
    needsUpdate = !facility.every(iterator);
  }
  return needsUpdate;
};

/**
 * Remove non-selected issues from VA locations and private facilities
 * Needed in case issues are added or changed on the review & submit page. The
 * evidence entries need to be auto-updated
 * @param {Object} data - form data
 * @returns {Object} - cleaned up data
 */
export const removeNonSelectedIssuesFromEvidence = data => {
  const formData = data || {};
  const selectedIssues = getSelected(formData).map(getIssueName);
  const mapper = obj => ({
    ...obj,
    issues: obj.issues.filter(issue => selectedIssues.includes(issue)),
  });
  return {
    ...formData,
    locations: getVAEvidence(formData).map(mapper),
    providerFacility: getPrivateEvidence(formData).map(mapper),
  };
};

/**
 * Update the evidence location, if:
 * - New SC form toggle is enabled
 * - location evidenceDates "from" (YYYY-MM-DD) has a value
 * - location treatmentDate (YYYY-MM) is not defined
 * If all the above are true, then get the "from" evidenceDate, strip off the
 * day value and set the "treatmentDate" to that new value. The `noDate` value
 * is set to true if "from" date is undefined
 * @param {Object} formData - Form data from save-in-progress
 * @param {String} returnUrl - URL of last saved page
 * @param {Object} router - React router
 */
export const onFormLoaded = props => {
  let { returnUrl } = props;
  const { formData, router } = props;
  const { locations = [] } = formData;

  // New SC form data flow
  if (showScNewForm(formData)) {
    // Redirect Veteran to housing-risk page (second page in the flow), if
    // needed
    returnUrl = checkRedirect(formData, returnUrl);

    // Convert in progress VA location evidenceDates (YYYY-MM-DD) to
    // treatmentDate (YYYY-MM), or set the no date checkbox if the evidence
    // "from" date is undefined
    if (locations.length) {
      formData.locations = locations.map(location => {
        if (!location.treatmentDate) {
          const from = location.evidenceDates?.from || '';
          const treatmentDate = from.substring(0, from.lastIndexOf('-')).trim();
          const noDate = treatmentDate === '';
          return {
            ...location,
            treatmentDate,
            noDate,
          };
        }
        return location;
      });
    }
  }
  router?.push(returnUrl);
};
