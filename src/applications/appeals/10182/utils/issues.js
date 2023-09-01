import { getEligibleContestableIssues } from './submit';

// This function checks whether contestable issue data loaded from the API (`loaded`)
// is different from the contestable issue data already present in `formData`
// (`formIssues`). We use it to determine whether we need to update `formData`.
// with contestable issue data from the API. This function is adapted from the
// `issuesNeedUpdating` function defined in `src/applications/appeals/shared/utils/issues.js`.
// The only difference is that we are calling `getEligibleContestableIssues`
// instead of `processContestableIssues`. This ensures that we are comparing
// filtered data from the API with filtered data from `formData`.
export const issuesNeedUpdating = (
  loaded = [],
  formIssues = [],
  options = {},
) => {
  const { showPart3 } = options;
  // `getEligibleContestableIssues` filters out deferred issues, and issues
  // with a decision date older than a year.
  const loadedIssues = getEligibleContestableIssues(loaded, { showPart3 });
  const existingIssues = getEligibleContestableIssues(formIssues, {
    showPart3,
  });
  return loadedIssues.length !== existingIssues.length
    ? true
    : !loadedIssues.every(({ attributes }, index) => {
        const existing = existingIssues[index]?.attributes || {};
        return (
          attributes.ratingIssueSubjectText ===
            existing.ratingIssueSubjectText &&
          attributes.approxDecisionDate === existing.approxDecisionDate
        );
      });
};
