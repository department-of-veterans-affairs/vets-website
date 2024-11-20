import { EVIDENCE_VA, EVIDENCE_PRIVATE, EVIDENCE_OTHER } from '../constants';

import { getIssueName, getSelected } from '../../shared/utils/issues';

export const hasVAEvidence = formData => formData?.[EVIDENCE_VA];
export const hasPrivateEvidence = formData => formData?.[EVIDENCE_PRIVATE];
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
