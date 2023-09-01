import { getEligibleContestableIssues } from './submit';

export const issuesNeedUpdating = (
  loaded = [],
  formIssues = [],
  options = {},
) => {
  const { showPart3 } = options;
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
