// Wizard helps
import { WIZARD_STATUS_COMPLETE } from '@department-of-veterans-affairs/platform-site-wide/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';

// Mock data (profile, SIP, debts/copays)
import mockUser from './fixtures/mocks/mockUser.json';
import mockData from './fixtures/data/efsr-maximal.json';
import saveInProgress from './fixtures/mocks/saveInProgress.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';

// Contact Info Mocks
import mockStatus from './fixtures/mocks/contact-info-mocks/profile-status.json';
import mockTelephoneUpdate from './fixtures/mocks/contact-info-mocks/telephone-update.json';
import mockTelephoneUpdateSuccess from './fixtures/mocks/contact-info-mocks/telephone-update-success.json';

// Helpful constants that we'll probably remove shortly
const BASE_URL = '/manage-va-debt/request-debt-help-form-5655';
const CONTACT_INFO_PATH = 'current-contact-information';
const MAIN_CONTACT_PATH = `${BASE_URL}/${CONTACT_INFO_PATH}`;

describe('5655 contact info loop', () => {
  Cypress.config({ requestTimeout: 10000 });

  beforeEach(() => {
    window.dataLayer = [];
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
          { name: 'combined_financial_status_report', value: true },
          {
            name: 'combined_financial_status_report_enhancements',
            value: true,
          },
        ],
      },
    }).as('features');

    // Save in Progress
    cy.intercept('PUT', '/v0/in_progress_forms/5655', mockData);
    cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgress);

    // Profile Info
    cy.login(mockUser);
    cy.intercept('GET', '/v0/profile/status', mockStatus);
    cy.intercept('GET', '/v0/maintenance_windows', []);

    // Telephone info
    cy.intercept('PUT', '/v0/profile/telephones', mockTelephoneUpdate);
    cy.intercept('GET', '/v0/profile/status/*', mockTelephoneUpdateSuccess);

    // Debt and Copay Info
    cy.intercept('GET', '/v0/debts', debts);
    cy.intercept('GET', '/v0/medical_copays', copays);

    cy.visit(`${BASE_URL}`);
    cy.wait('@features');
    cy.injectAxe();
  });

  const getToContactPage = () => {
    // start form
    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
    cy.findAllByText(/start/i, { selector: 'button' })
      .first()
      .click();

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${BASE_URL}/veteran-information`);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    // Debt selection (Keep it minimal w/ debt just to get to next page)
    cy.location('pathname').should('eq', `${BASE_URL}/all-available-debts`);
    cy.get(`input[name="request-help-with-debt"]`)
      .first()
      .check();
    cy.get('.usa-button-primary').click();
  };

  it('should edit info on a new page & cancel returns to contact info page', () => {
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
  it('should edit info on a new page, update & return to contact info page', () => {
    getToContactPage();

    cy.intercept('/v0/profile/telephones', mockTelephoneUpdateSuccess);

    // Mobile phone
    cy.get('a[href$="mobile-phone"]').click();
    cy.contains('Edit phone number').should('be.visible');
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
