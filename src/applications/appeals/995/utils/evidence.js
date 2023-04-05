import { getSelected, getIssueName } from './helpers';

import { EVIDENCE_VA, EVIDENCE_PRIVATE, EVIDENCE_OTHER } from '../constants';

export const hasVAEvidence = formData => formData?.[EVIDENCE_VA];
export const hasPrivateEvidence = formData => formData?.[EVIDENCE_PRIVATE];
export const hasOtherEvidence = formData => formData?.[EVIDENCE_OTHER];

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
  let noUpdate = true;
  const selectedIssues = getSelected(formData).map(getIssueName);
  const iterator = ({ issues }) =>
    (issues || []).every(issue => selectedIssues.includes(issue));

  if (hasVAEvidence(formData)) {
    noUpdate = (formData.locations || []).every(iterator);
  }
  if (noUpdate && hasPrivateEvidence(formData)) {
    noUpdate = (formData.providerFacility || []).every(iterator);
  }
  return !noUpdate;
};

/**
 * Remove non-selected issues from VA locations and private facilities
 * Needed in case issues are added or changed on the review & submit page. The
 * evidence entries need to be auto-updated
 * @param {Object} data - form data
 * @returns {Object} - cleaned up data
 */
export const removeNonSelectedIssuesFromEvidence = formData => {
  const selectedIssues = getSelected(formData).map(getIssueName);
  const mapper = obj => ({
    ...obj,
    issues: obj.issues.filter(issue => selectedIssues.includes(issue)),
  });
  return {
    ...formData,
    location: formData.location.map(mapper),
    providerFacility: formData.providerFacility.map(mapper),
  };
};
