import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import featuresDisabled from '../fixtures/mocks/featuresDisabled.json';
import featuresEnabled from '../fixtures/mocks/featuresEnabled.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';

const TEST_URL =
  '/pension/apply-for-veteran-pension-form-21p-527ez/introduction';
const IN_PROGRESS_URL = '/v0/in_progress_forms/21P-527EZ';
const PENSIONS_CLAIMS_URL = '/v0/pension_claims';
const SUBMISSION_DATE = new Date().toISOString();

const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

export const cypressBeforeAllSetup = () => {
  cy.config('numTestsKeptInMemory', 0);
  cy.config('waitForAnimations', true);

  Cypress.on('window:before:load', window => {
    const win = window;
    const original = win.addEventListener;
    win.addEventListener = function addEventListener(...args) {
      if (args && args[0] === 'beforeunload') {
        return null;
      }
      return original.apply(this, args);
    };
  });
};

const cypressSetup = ({ authenticated, isEnabled = true } = {}) => {
  const features = isEnabled ? featuresEnabled : featuresDisabled;

  cy.intercept('GET', '/v0/feature_toggles*', features);
  cy.intercept('GET', '/v0/maintenance_windows', []);
  cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);

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

  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }
  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.login(loggedInUser);
  cy.visit(TEST_URL);
};

export default cypressSetup;
