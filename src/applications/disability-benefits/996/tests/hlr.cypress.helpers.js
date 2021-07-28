import moment from 'moment';

const date = moment()
  .subtract(2, 'months')
  .format('YYYY-MM-DD');

export const mockContestableIssues = {
  data: [
    {
      id: null,
      type: 'contestableIssue',
      attributes: {
        ratingIssueReferenceId: '142926',
        ratingIssueProfileDate: date,
        ratingIssueDiagnosticCode: '6260',
        ratingIssueSubjectText: 'Tinnitus',
        ratingIssuePercentNumber: '0',
        description:
          'Service connection for Tinnitus is granted with an evaluation of 0 percent effective September 25, 2019.',
        isRating: true,
        latestIssuesInChain: [
          {
            id: null,
            approxDecisionDate: date,
          },
        ],
        decisionIssueId: null,
        ratingDecisionReferenceId: null,
        approxDecisionDate: date,
        rampClaimId: null,
        titleOfActiveReview: null,
        sourceReviewType: null,
        timely: true,
      },
    },
    {
      id: null,
      type: 'contestableIssue',
      attributes: {
        ratingIssueReferenceId: '142927',
        ratingIssueProfileDate: date,
        ratingIssueDiagnosticCode: '9411',
        ratingIssueSubjectText: 'PTSD',
        ratingIssuePercentNumber: '30',
        description:
          'Service connection for PTSD is granted with an evaluation of 30 percent effective March 5, 2019.',
        isRating: true,
        latestIssuesInChain: [
          {
            id: null,
            approxDecisionDate: date,
          },
        ],
        decisionIssueId: null,
        ratingDecisionReferenceId: null,
        approxDecisionDate: date,
        rampClaimId: null,
        titleOfActiveReview: null,
        sourceReviewType: null,
        timely: true,
      },
    },
  ],
};
