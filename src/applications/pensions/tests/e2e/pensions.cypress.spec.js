import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import featuresDisabled from '../fixtures/mocks/featuresDisabled.json';
import featuresEnabled from '../fixtures/mocks/featuresEnabled.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import {
  fillAddressWebComponentPattern,
  selectRadioWebComponent,
} from './helpers';

import pagePaths from './pagePaths';

const TEST_URL = '/pension/application/527EZ/introduction';
const IN_PROGRESS_URL = '/v0/in_progress_forms/21P-527EZ';
const PENSIONS_CLAIMS_URL = '/v0/pension_claims';
const SUBMISSION_DATE = new Date().toISOString();

const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

export const setup = ({ authenticated, isEnabled = true } = {}) => {
  const features = isEnabled ? featuresEnabled : featuresDisabled;
  cy.intercept('GET', '/v0/feature_toggles*', features);

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

  cy.intercept('POST', PENSIONS_CLAIMS_URL, {
    data: {
      id: '8',
      type: 'saved_claim_pensions',
      attributes: {
        submittedAt: SUBMISSION_DATE,
        regionalOffice: [
          'Attention:  Philadelphia Pension Center',
          'P.O. Box 5206',
          'Janesville, WI 53547-5206',
        ],
        confirmationNumber: SUBMISSION_CONFIRMATION_NUMBER,
        guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
        form: '21P-527EZ',
      },
    },
  }).as('submitApplication');

  cy.intercept(
    'GET',
    `${PENSIONS_CLAIMS_URL}/${SUBMISSION_CONFIRMATION_NUMBER}`,
    {
      data: {
        attributes: {
          submittedAt: SUBMISSION_DATE,
          state: 'success',
        },
      },
    },
  ).as('pollSubmission');

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
    cy.findAllByText(/start the pension application/i)
      .first()
      .click();
  },
  [pagePaths.mailingAddress]: () => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('veteranAddress', data.veteranAddress);
    });
  },
  [pagePaths.maritalStatus]: () => {
    cy.get('@testData').then(data => {
      selectRadioWebComponent('maritalStatus', data.maritalStatus);
    });
  },
  [pagePaths.marriageInfo]: () => {
    cy.get('@testData').then(data => {
      // TODO Fix this
      cy.get('#root_marriages').type(`${data.marriages.length}`, {
        force: true,
      });
    });
  },
  [pagePaths.currentSpouseAddress]: () => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('spouseAddress', data.spouseAddress);
    });
  },
  // [pagePaths.dependentChildAddress]: ({ index }) => {
  //   cy.get('@testData').then(data => {
  //     fillAddressWebComponentPattern(
  //       'childAddress',
  //       data.dependents[index].childAddress,
  //     );
  //   });
  // },
  'review-and-submit': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        cy.get('#veteran-signature')
          .shadow()
          .find('input')
          .first()
          .type(data.statementOfTruthSignature);
        cy.get(`#veteran-certify`)
          .first()
          .shadow()
          .find('input')
          .check();
        cy.findAllByText(/Submit application/i, {
          selector: 'button',
        }).click();
      });
    });
  },
});

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: path.join('..', 'node_modules', 'vets-json-schema', 'dist'),
    dataSets: [
      '21P-527EZ-kitchen_sink-cypress-example',
      '21P-527EZ-overflow-cypress-example',
      '21P-527EZ-simple-cypress-example',
    ],
    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy);
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
