import { getEligibleContestableIssues } from './submit';

// This function checks whether contestable issue data loaded from the API (`loadedIssues`)
// is different from the contestable issue data already present in `formData`
// (`existingIssues`). We use it to determine whether we need to update `formData`.
// with contestable issue data from the API. This function is adapted from the
// `issuesNeedUpdating` function defined in `src/applications/appeals/shared/utils/issues.js`.
// The only difference (other than variable naming) is that we are calling
// `getEligibleContestableIssues` instead of `processContestableIssues`.
// This ensures that we are comparing filtered data from the API with filtered
// data from `formData`.
export const issuesNeedUpdating = (
  loadedIssues = [],
  existingIssues = [],
  options = {},
) => {
  const { showPart3 } = options;
  // `getEligibleContestableIssues` filters out deferred issues, and issues
  // with a decision date older than a year.
  const filteredLoadedIssues = getEligibleContestableIssues(loadedIssues, {
    showPart3,
  });
  const filteredExistingIssues = getEligibleContestableIssues(existingIssues, {
    showPart3,
  });
  return filteredLoadedIssues.length !== filteredExistingIssues.length
    ? true
    : !filteredLoadedIssues.every(({ attributes }, index) => {
        const existing = filteredExistingIssues[index]?.attributes || {};
        return (
          attributes.ratingIssueSubjectText ===
            existing.ratingIssueSubjectText &&
          attributes.approxDecisionDate === existing.approxDecisionDate
        );
      });
};
