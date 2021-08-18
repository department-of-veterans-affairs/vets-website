import { getDate } from '../utils/dates';
import { SELECTED } from '../constants';

export const getRandomDate = () =>
  getDate({
    offset: {
      months: -Math.floor(Math.random() * 6 + 1),
      days: -Math.floor(Math.random() * 10),
    },
  });

export const fixDecisionDates = (data = []) => {
  return data.map(issue => {
    const newDate = getRandomDate();
    // remove selected value so Cypress can click-select
    if (issue.decisionDate) {
      return {
        ...issue,
        decisionDate: newDate,
        [SELECTED]: false,
      };
    }
    return {
      ...issue,
      attributes: {
        ...issue.attributes,
        approxDecisionDate: newDate,
      },
      [SELECTED]: false,
    };
  });
};

const date = getDate({ offset: { months: -2 } });

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
