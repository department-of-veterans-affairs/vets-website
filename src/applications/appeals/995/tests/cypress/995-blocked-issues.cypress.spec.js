/**
 * E2E test for blocked issues on 995 form.
 */
import path from 'path';
import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { setupPerTest, pageHooks } from './995.cypress.helpers';
import { NOV_2025_REDESIGN_TOGGLE, TOGGLE_KEY } from '../../constants';
import { parseDateWithOffset } from '../../../shared/utils/dates';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';
import { CONTESTABLE_ISSUES_PATH } from '../../../shared/constants';

const setupPerTestBlockedIssues = (testData, toggles = []) => {
  setupPerTest(testData, toggles);

  const today = parseDateWithOffset({});
  const mockBlockedIssues = {
    data: [
      {
        id: null,
        type: 'contestableIssue',
        attributes: {
          ratingIssueReferenceId: '66',
          ratingIssueSubjectText: 'Headaches',
          ratingIssuePercentNumber: '20',
          approxDecisionDate: '2021-06-10',
          description: 'Acute chronic head pain',
          isRating: true,
          latestIssuesInChain: [{ id: null, approxDecisionDate: '2021-06-10' }],
          decisionIssueId: 44,
          ratingDecisionReferenceId: null,
        },
      },
      {
        id: null,
        type: 'contestableIssue',
        attributes: {
          ratingIssueReferenceId: '142926',
          ratingIssueSubjectText: 'Blocked Issue (Today)',
          ratingIssuePercentNumber: '10',
          approxDecisionDate: today,
          description:
            'This issue decision was made today and should be blocked',
          isRating: true,
          latestIssuesInChain: [{ id: null, approxDecisionDate: today }],
          decisionIssueId: null,
          ratingDecisionReferenceId: null,
        },
      },
    ],
  };

  cy.intercept(
    'GET',
    `${CONTESTABLE_ISSUES_API}/compensation`,
    mockBlockedIssues,
  ).as('getIssues');
};

const pageHooksWithAccessibilityChecks = {
  ...pageHooks,
  [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('#blocked-issues-alert', { timeout: 10000 }).should('be.visible');
      cy.get('#blocked-issues-alert')
        .should('be.visible')
        .and(
          'contain',
          "We're sorry. Your blocked issue (today) issue isn't available",
        );
      cy.contains('Headaches')
        .should('be.visible')
        .parents('li')
        .within(() => {
          cy.get('va-checkbox').should('exist');
        });
      cy.contains('Blocked Issue (Today)')
        .should('be.visible')
        .parents('li')
        .within(() => {
          cy.get('va-checkbox').should('not.exist');
          cy.get('.vads-u-margin-left--4').should('exist');
        });
      cy.contains('Headaches')
        .parents('li')
        .find('va-checkbox')
        .click();

      cy.get('#blocked-issues-alert')
        .should('contain', '12:00 a.m.')
        .and('not.contain', '5:00 p.m.');

      const { clickContinue } = require('./995.cypress.helpers');
      clickContinue();
    });
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['pre-api-minimal-test'],
    fixtures: {
      data: path.join(__dirname, '..', 'fixtures', 'data'),
      mocks: path.join(__dirname, '..', 'fixtures', 'mocks'),
    },
    pageHooks: pageHooksWithAccessibilityChecks,
    setupPerTest: data => {
      const toggles = [
        {
          name: NOV_2025_REDESIGN_TOGGLE,
          value: false,
        },
        {
          name: TOGGLE_KEY,
          value: false,
        },
      ];
      setupPerTestBlockedIssues(data, toggles);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
