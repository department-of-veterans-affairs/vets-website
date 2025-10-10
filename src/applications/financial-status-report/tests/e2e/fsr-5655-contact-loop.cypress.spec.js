import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import manifest from '../../manifest.json';

import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';

import copays from './fixtures/mocks/copays.json';
import debts from './fixtures/mocks/debts.json';

import saveInProgress from './fixtures/mocks/saveInProgress.json';

// Telephone specific responses
import mockTelephoneUpdate from './fixtures/mocks/telephone-update.json';
import mockTelephoneUpdateSuccess from './fixtures/mocks/telephone-update-success.json';

describe.skip('fsr 5655 contact info loop', () => {
  Cypress.config({ requestTimeout: 10000 });
  const BASE_URL = manifest.rootUrl;
  const MAIN_CONTACT_PATH = `${BASE_URL}/current-contact-information`;

  beforeEach(() => {
    window.dataLayer = [];
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    }).as('features');

    sessionStorage.setItem('wizardStatus', WIZARD_STATUS_COMPLETE);

    cy.intercept('GET', '/v0/debts', debts);
    cy.intercept('GET', '/v0/medical_copays', copays);
    cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgress);

    // telephone
    cy.intercept('PUT', '/v0/profile/telephones', mockTelephoneUpdate);
    cy.intercept('GET', '/v0/profile/status/*', mockTelephoneUpdateSuccess);

    cy.login(mockUser);
    cy.intercept('GET', '/v0/profile/status', mockStatus);
    cy.intercept('GET', '/v0/maintenance_windows', []);

    cy.visit(manifest.rootUrl);
    cy.wait('@features');
    cy.injectAxe();
  });

  const getToContactPage = () => {
    // start form
    // wizard is skipped
    cy.clickStartForm();

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${BASE_URL}/veteran-information`);
    cy.clickFormContinue();

    // Select debts & copays
    cy.location('pathname').should('eq', `${BASE_URL}/all-available-debts`);
    cy.get(`[data-testid="debt-selection-checkbox"]`)
      .eq(0)
      .shadow()
      .find('input[type=checkbox]')
      .check({ force: true });
    cy.get(`[data-testid="copay-selection-checkbox"]`)
      .eq(0)
      .shadow()
      .find('input[type=checkbox]')
      .check({ force: true });
    cy.clickFormContinue();
  };

  it('should edit info on a new page & cancel returns to contact info page - C30848', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
    cy.injectAxe();
    cy.axeCheck();

    // Mobile phone
    cy.clickFormContinue();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).clickFormContinue();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Email
    cy.clickFormContinue();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-email-address`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).clickFormContinue();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Mailing address
    cy.clickFormContinue();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mailing-address`);
    cy.injectAxe();
    cy.axeCheck();

    cy.clickFormContinue();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should edit info on a new page, update & return to contact info page ', () => {
    getToContactPage();
    cy.intercept('/v0/profile/telephones', mockTelephoneUpdateSuccess);

    // Contact info

    // Mobile phone
    cy.clickFormContinue();
    cy.contains('Edit mobile phone number').should('be.visible');
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);

    cy.findByLabelText(/mobile phone/i)
      .clear()
      .type('8885551212');
    cy.clickFormContinue();

    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Skipping AXE-check; already done in previous test.
  });
});
