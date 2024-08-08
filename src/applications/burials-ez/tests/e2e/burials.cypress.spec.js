import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import maximalFixture from '../schema/maximal-test.json';
import minimalFixture from '../schema/minimal-test.json';
import overflowFixture from '../schema/overflow-test.json';

import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import featuresEnabled from '../fixtures/mocks/featuresEnabled.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import {
  fillAddressWebComponentPattern,
  selectCheckboxWebComponent,
  selectRadioWebComponent,
} from './helpers';

import pagePaths from './pagePaths';

const TEST_URL =
  '/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez/introduction';
const IN_PROGRESS_URL = '/v0/in_progress_forms/21P-530V2';
const BURIALS_CLAIMS_URL = '/v0/burial_claims';
const CLAIM_ATTACHMENTS_URL = '/v0/claim_attachments';
const SUBMISSION_DATE = new Date().toISOString();

const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

export const setup = ({ authenticated } = {}) => {
  cy.intercept('GET', '/v0/feature_toggles*', featuresEnabled);

  cy.get('@testData').then(testData => {
    cy.intercept('GET', IN_PROGRESS_URL, {
      formData: {},
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/applicant/information',
      },
    });
    cy.intercept('PUT', IN_PROGRESS_URL, testData);
  });

  cy.intercept('POST', BURIALS_CLAIMS_URL, {
    data: {
      id: '8',
      type: 'saved_claim',
      attributes: {
        submittedAt: SUBMISSION_DATE,
        regionalOffice: [
          'Attention:  Philadelphia Pension Center',
          'P.O. Box 5206',
          'Janesville, WI 53547-5206',
        ],
        confirmationNumber: SUBMISSION_CONFIRMATION_NUMBER,
        guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
        form: '21P-530V2',
      },
    },
  }).as('submitApplication');

  cy.intercept(
    'GET',
    `${BURIALS_CLAIMS_URL}/${SUBMISSION_CONFIRMATION_NUMBER}`,
    {
      data: {
        attributes: {
          submittedAt: SUBMISSION_DATE,
          state: 'success',
        },
      },
    },
  ).as('pollSubmission');

  cy.intercept('POST', CLAIM_ATTACHMENTS_URL, {
    data: {
      attributes: {
        confirmationCode: 'f3111a5f-e86f-4c8d-96c7-9bba6eee13e5',
        name: 'image.png',
        size: 65645,
      },
      id: '11',
      type: 'persistent_attachments',
    },
  });

  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }
  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.login(loggedInUser);
  cy.visit(TEST_URL);
};

export const pageHooks = cy => ({
  introduction: () => {
    // skip wizard
    cy.findAllByText(
      /Start the burial allowance and transportation benefits application/i,
    )
      .first()
      .click();
  },
  [pagePaths.mailingAddress]: () => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('claimantAddress', data.claimantAddress);
    });
  },
  [pagePaths.separationDocuments]: () => {
    cy.get('@testData').then(() => {
      selectRadioWebComponent('root_view:separationDocuments', 'N');
    });
  },
  [pagePaths.previousNamesQuestion]: () => {
    cy.get('@testData').then(() => {
      selectRadioWebComponent('root_view:servedUnderOtherNames', 'N');
    });
  },
  [pagePaths.benefitsSelection]: () => {
    cy.get('@testData').then(() => {
      selectCheckboxWebComponent(
        'root_view:claimedBenefits_burialAllowance',
        true,
      );
    });
  },
  [pagePaths.burialAllowancePartOne]: () => {
    cy.get('@testData').then(() => {
      selectCheckboxWebComponent('root_burialAllowanceRequested_service', true);
    });
  },
  [pagePaths.burialAllowancePartTwo]: () => {
    cy.get('@testData').then(() => {
      selectRadioWebComponent('root_burialExpenseResponsibility', 'N');
      if (
        Cypress.$('va-radio-option[name="root_previouslyReceivedAllowance"]')
          .length
      ) {
        cy.get(
          `va-radio-option[name="root_previouslyReceivedAllowance"][value="N"]`,
        )?.click();
      }
    });
  },
  [pagePaths.finalRestingPlace]: () => {
    cy.get('@testData').then(() => {
      selectRadioWebComponent('root_finalRestingPlace_location', 'cemetery');
    });
  },
  [pagePaths.cemeteryLocationQuestion]: () => {
    cy.get('@testData').then(() => {
      selectRadioWebComponent('root_cemetaryLocationQuestion', 'none');
    });
  },
  [pagePaths.confirmation]: () => {},
});

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Burials EZ',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      { title: 'overflow', data: overflowFixture },
      { title: 'minimal', data: minimalFixture },
      { title: 'maximal', data: maximalFixture },
    ],
    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup();
      cy.injectAxeThenAxeCheck();
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
