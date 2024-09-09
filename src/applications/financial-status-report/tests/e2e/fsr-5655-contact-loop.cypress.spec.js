import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import manifest from '../../manifest.json';

import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';

import copays from './fixtures/mocks/copays.json';
import debts from './fixtures/mocks/debts.json';

import saveInProgress from './fixtures/mocks/saveInProgress.json';
import { WIZARD_STATUS } from '../../wizard/constants';

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

    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);

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
    cy.get('a.vads-c-action-link--green')
      .first()
      .click();

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${BASE_URL}/veteran-information`);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    // Select debts & copays
    cy.location('pathname').should('eq', `${BASE_URL}/all-available-debts`);
    cy.get(`input[name="request-help-with-debt"]`)
      .first()
      .check();
    cy.get(`input[name="request-help-with-copay"]`)
      .first()
      .check();
    cy.get('.usa-button-primary').click();
  };

  it('should edit info on a new page & cancel returns to contact info page - C30848', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
    cy.injectAxe();
    cy.axeCheck();

    // Mobile phone
    cy.get('a[href$="mobile-phone"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Email
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-email-address`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Mailing address
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mailing-address`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should edit info on a new page, update & return to contact info page ', () => {
    getToContactPage();
    cy.intercept('/v0/profile/telephones', mockTelephoneUpdateSuccess);

    // Contact info

    // Mobile phone
    cy.get('a[href$="mobile-phone"]').click();
    cy.contains('Edit mobile phone number').should('be.visible');
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);

    cy.findByLabelText(/mobile phone/i)
      .clear()
      .type('8885551212');
    cy.findAllByText(/save/i, { selector: 'button' })
      .first()
      .click();

    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Skipping AXE-check; already done in previous test.
  });
});
