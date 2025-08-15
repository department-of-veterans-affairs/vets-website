import { setupInProgressReturnUrl } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import featuresDisabled from '../fixtures/mocks/featuresDisabled.json';
import featuresEnabled from '../fixtures/mocks/featuresEnabled.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';
import mockPrefill from '../fixtures/mocks/prefill.json';
import inProgressForms from '../fixtures/mocks/in-progress-forms.json';

const FORM_ID = '21P-527EZ';
const TEST_URL =
  '/pension/apply-for-veteran-pension-form-21p-527ez/introduction';
const IN_PROGRESS_URL = `/v0/in_progress_forms/${FORM_ID}`;
const PENSIONS_CLAIMS_URL = 'pensions/v0/claims';
const SUBMISSION_DATE = new Date().toISOString();

const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

export const cypressBeforeAllSetup = () => {
  cy.config('numTestsKeptInMemory', 0);
  cy.config('waitForAnimations', true);
};

const cypressSetup = ({
  authenticated = true,
  isEnabled = true,
  returnUrl,
  prefill = {},
} = {}) => {
  const features = isEnabled ? featuresEnabled : featuresDisabled;

  cy.intercept('GET', '/v0/feature_toggles*', features);
  cy.intercept('GET', '/v0/maintenance_windows', []);
  cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);

  // cy.get('@testData').then(testData => {
  if (authenticated) {
    if (returnUrl) {
      // Set up in progress form to go to returnUrl on continuing a form
      setupInProgressReturnUrl({
        formConfig,
        returnUrl,
        prefill,
        user: loggedInUser,
      });
    } else {
      cy.intercept('GET', IN_PROGRESS_URL, mockPrefill);
      cy.login(loggedInUser);
    }
    cy.intercept('PUT', IN_PROGRESS_URL, inProgressForms);
  }
  // });

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

  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.visit(TEST_URL);
};

export default cypressSetup;
