import { SELECTED } from '../constants';

export const getContestableIssue = (id, selected) => ({
  ratingIssueSubjectText: `issue-${id}`,
  description: 'blah',
  ratingIssuePercentNumber: id,
  approxDecisionDate: `2021-01-${id}`,
  [SELECTED]: selected,
});

export const getAdditionalIssue = (id, selected) => ({
  issue: `new-issue-${id}`,
  decisionDate: `2021-02-${id}`,
  [SELECTED]: selected,
});
