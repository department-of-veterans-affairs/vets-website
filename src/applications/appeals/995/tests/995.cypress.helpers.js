import { getDate } from '../utils/dates';
import { SELECTED } from '../../shared/constants';

export const getRandomDate = () =>
  getDate({
    offset: {
      months: -Math.floor(Math.random() * 6 + 1),
      days: -Math.floor(Math.random() * 10),
    },
  });

export const fetchItf = () => ({
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2022-07-28T19:53:45.810+00:00',
          // pattern null = ISO8601 format
          expirationDate: getDate({ offset: { months: 3 }, pattern: null }),
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
        },
      ],
    },
  },
});

export const getPastItf = cy => {
  cy.get('.itf-inner')
    .should('be.visible')
    .then(() => {
      // Click past the ITF message
      cy.get('va-button-pair')
        .shadow()
        .find('va-button[continue]')
        .shadow()
        .find('button')
        .click();
    });
};

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

const twoIssues = [
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
      latestIssuesInChain: [{ id: null, approxDecisionDate: date }],
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
      ratingIssueSubjectText: 'Headaches',
      ratingIssuePercentNumber: '30',
      description: 'Acute chronic head pain',
      isRating: true,
      latestIssuesInChain: [{ id: null, approxDecisionDate: date }],
      decisionIssueId: null,
      ratingDecisionReferenceId: null,
      approxDecisionDate: date,
      rampClaimId: null,
      titleOfActiveReview: null,
      sourceReviewType: null,
      timely: true,
    },
  },
];

export const mockContestableIssues = {
  data: [
    ...twoIssues,
    {
      id: null,
      type: 'legacyAppeal',
      attributes: {
        issues: [],
      },
    },
  ],
};

export const mockContestableIssuesWithLegacyAppeals = {
  data: [
    ...twoIssues,
    {
      id: null,
      type: 'legacyAppeal',
      attributes: {
        issues: [
          {
            description: 'Service connection, sleep apnea',
            diagnosticCode: '6847',
            active: true,
            lastAction: null,
            date: null,
          },
          {
            description: 'Service connection, tinnitus',
            diagnosticCode: '6847',
            active: true,
            lastAction: 'field_grant',
            date: null,
          },
        ],
      },
    },
  ],
};
