import { getDate } from '../utils/dates';
import { SELECTED } from '../constants';

export const getRandomDate = () =>
  getDate({
    offset: {
      months: -Math.floor(Math.random() * 6 + 1),
      days: -Math.floor(Math.random() * 10),
    },
  });

export const fixDecisionDates = (data = [], { unselected } = {}) => {
  return data.map(issue => {
    const newDate = getRandomDate();
    // remove selected value so Cypress can click-select
    if (issue.decisionDate) {
      return {
        ...issue,
        decisionDate: newDate,
        [SELECTED]: unselected ? false : issue[SELECTED],
      };
    }
    return {
      ...issue,
      attributes: {
        ...issue.attributes,
        approxDecisionDate: newDate,
      },
      [SELECTED]: unselected ? false : issue[SELECTED],
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

/**
 * Area of disagreement page Cypress e2e test
 */
export const areaOfDisagreementPageHook = ({ afterHook, index }) => {
  cy.injectAxeThenAxeCheck();
  afterHook(() => {
    cy.get('@testData').then(testData => {
      const { areaOfDisagreement } = testData;
      const { disagreementOptions, otherEntry } = areaOfDisagreement[index];
      Object.entries(disagreementOptions).forEach(([key, value]) => {
        if (value) {
          cy.get(`va-checkbox[name="${key}"]`).click();
        }
      });
      if (otherEntry) {
        cy.get('va-text-input')
          .shadow()
          .find('input')
          .type(otherEntry);
      }
      cy.findByText('Continue', { selector: 'button' }).click();
    });
  });
};
