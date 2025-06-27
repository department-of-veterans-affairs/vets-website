import loggedInUser from '../../fixtures/mocks/loggedInUser.json';
import featuresEnabled from '../../fixtures/mocks/featuresEnabled.json';
import mockStatus from '../../fixtures/mocks/profile-status.json';
import pagePaths from '../pagePaths';

// navigation helpers
export const goToNextPage = pagePath => {
  // clicks Continue button, and optionally checks destination path.
  cy.findAllByText(/continue/i, { selector: 'button' }).click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

// single field fill helpers
export const fillTextWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-text-input[name="root_${fieldName}"]`)
      .shadow()
      .find('input')
      .type(value);
  }
};

export const selectCheckboxWebComponent = (fieldName, condition) => {
  if (condition) {
    cy.get(`va-checkbox[name="${fieldName}"]`)
      .shadow()
      .find('label')
      .click();
  }
};

export const selectDropdownWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-select[name="root_${fieldName}"]`)
      .shadow()
      .find('select')
      .select(value);
  }
};

export const selectRadioWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-radio-option[name="${fieldName}"][value="${value}"]`).click();
  }
};

const TEST_URL =
  '/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez/introduction';
const IN_PROGRESS_URL = '/v0/in_progress_forms/21P-530EZ';
const BURIALS_CLAIMS_URL = '/burials/v0/claims';
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
        form: '21P-530EZ',
      },
    },
  }).as('submitApplication');

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
      cy.fillAddressWebComponentPattern(
        'claimantAddress',
        data.claimantAddress,
      );
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
