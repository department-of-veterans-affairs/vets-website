import { add, formatISO } from 'date-fns';
import { parseDateWithOffset } from '../utils/dates';
import { SELECTED } from '../constants';

export const START_LINK = 'va-link-action[href="#start"]';
export const CONTINUE_APP_LINK =
  'va-button[data-testid="continue-your-application"]';

export const verifyElement = selector => cy.get(selector).should('exist');

export const verifyElementDoesNotExist = selector =>
  cy.get(selector).should('not.exist');

export const selectRadio = (parentSelector, index) =>
  cy
    .get(parentSelector)
    .should('exist')
    .get('va-radio-option')
    .eq(index)
    .click();

export const startAppKeyboard = () => {
  cy.get(START_LINK)
    .should('exist')
    .and('be.visible');
  cy.tabToElement(START_LINK);
  cy.realPress('Enter');
};

export const startApp = () =>
  cy
    .get(START_LINK)
    .first()
    .click();

export const verifyCorrectUrl = (root, link) => {
  let expectation = `${root}/${link}`;

  if (link.startsWith('/')) {
    expectation = `${root}${link}`;
  }

  cy.url().should('contain', expectation);
};

export const tabToContinue = () => {
  // Tabbing to keyboard-press buttons often doesn't work because they take
  // a moment to load. The added wait may help.
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
  cy.get('va-button[continue]')
    .should('exist')
    .and('be.visible');
  cy.tabToElement('va-button[continue]');
  cy.realPress('Space');
};

export const getRandomDate = (offset = Math.random() * 6) =>
  parseDateWithOffset({
    months: -Math.floor(3 + offset),
    days: -Math.floor(offset),
  });

export const fixDecisionDates = (data = [], { unselected } = {}) => {
  return data.map((issue, index) => {
    // Pass in an index to maintain mock data issue order
    const newDate = getRandomDate(index);
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

const date = parseDateWithOffset({ months: -2 });

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

export const getPastItf = cy => {
  cy.wait('@getIssues');
  cy.get('va-alert')
    .should('be.visible')
    .then(() => {
      // Click past the ITF message
      cy.selectVaButtonPairPrimary();
    });
};

export const fetchItf = (
  offset = { months: 3 },
  status = 'active',
  type = 'compensation',
) => ({
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2022-07-28T19:53:45.810+00:00',
          // pattern null = ISO8601 format
          expirationDate: formatISO(add(new Date(), offset)),
          participantId: 1,
          source: 'EBN',
          status,
          type,
        },
        {
          id: '2',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.788+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '3',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '4',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'expired',
          type: 'compensation',
        },
        {
          id: '5',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.790+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'incomplete',
          type: 'compensation',
        },
      ],
    },
  },
});

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

      cy.clickFormContinue();
    });
  });
};
