import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import {
  BASE_URL,
  CONTESTABLE_ISSUES_API,
  CONTACT_INFO_PATH,
} from '../constants';

import mockV2Data from './fixtures/data/maximal-test.json';
import { getPastItf, fetchItf } from './995.cypress.helpers';

import cypressSetup from '../../shared/tests/cypress.setup';
import { mockContestableIssues } from '../../shared/tests/cypress.helpers';

import mockTelephoneUpdate from '../../shared/tests/fixtures/mocks/profile-telephone-update.json';
import mockTelephoneUpdateSuccess from '../../shared/tests/fixtures/mocks/profile-telephone-update-success.json';

describe('995 contact info loop', () => {
  Cypress.config({ requestTimeout: 10000 });
  const MAIN_CONTACT_PATH = `${BASE_URL}/${CONTACT_INFO_PATH}`;

  beforeEach(() => {
    cypressSetup();

    window.dataLayer = [];
    setStoredSubTask({ benefitType: 'compensation' });
    cy.intercept(
      'GET',
      `/v1${CONTESTABLE_ISSUES_API}compensation`,
      mockContestableIssues,
    ).as('getIssues');
    cy.intercept('GET', '/v0/in_progress_forms/20-0995', mockV2Data);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockV2Data);

    cy.intercept('GET', '/v0/intent_to_file', fetchItf());

    cy.intercept('PUT', '/v0/profile/telephones', mockTelephoneUpdate);
    cy.intercept('GET', '/v0/profile/status/*', mockTelephoneUpdateSuccess);

    cy.visit(BASE_URL);
    cy.wait('@features');
    cy.injectAxe();
  });

  const getToContactPage = () => {
    // start form
    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    getPastItf(cy);

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${BASE_URL}/veteran-information`);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();
  };

  it('should go to intro page when back button is selected on intent to file message', () => {
    cy.injectAxeThenAxeCheck();

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues'); // getContestableIssues API loading indicator
    cy.get('.itf-inner')
      .should('be.visible')
      .then(() => {
        // Click past the ITF message
        cy.selectVaButtonPairSecondary();
      });
    cy.location('pathname').should('eq', `${BASE_URL}/introduction`);
  });

  it('should edit info on a new page & cancel returns to contact info page - C30848', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
    cy.injectAxe();
    cy.axeCheck();

    // Home phone
    cy.get('a[href$="home-phone"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-home-phone`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Mobile phone
    cy.get('a[href$="mobile-phone"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-mobile-phone`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Email
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-email-address`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Mailing address
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-mailing-address`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should edit info on a new page, update & return to contact info page ', () => {
    getToContactPage();

    // Contact info

    // Mobile phone
    cy.get('a[href$="mobile-phone"]').click();
    cy.contains('Edit mobile phone number').should('be.visible');
    cy.location('pathname').should(
      'eq',
      `${MAIN_CONTACT_PATH}/edit-mobile-phone`,
    );

    cy.get('va-text-input[value="5109224444"]');

    cy.findAllByText(/save/i, { selector: 'button' })
      .first()
      .click();

    cy.wait('@telephones');
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Skipping AXE-check; already done in previous test.
  });
});
