import { CONTESTABLE_ISSUES_API } from '../constants';

import mockData from './fixtures/data/maximal-test.json';

import { NOD_BASE_URL, CONTACT_INFO_PATH } from '../../shared/constants';

import { mockContestableIssues } from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

const checkOpt = {
  waitForAnimations: true,
};

describe('NOD contact info loop', () => {
  const MAIN_CONTACT_PATH = `${NOD_BASE_URL}${CONTACT_INFO_PATH}`;

  beforeEach(() => {
    cypressSetup();
    window.dataLayer = [];

    cy.intercept(
      'GET',
      `/v0${CONTESTABLE_ISSUES_API}compensation`,
      mockContestableIssues,
    );
    cy.intercept(
      'GET',
      `/v1${CONTESTABLE_ISSUES_API}compensation`,
      mockContestableIssues,
    );

    cy.intercept('GET', '/v0/in_progress_forms/10182', mockData);
    cy.intercept('PUT', '/v0/in_progress_forms/10182', mockData);

    cy.visit(NOD_BASE_URL);
    cy.injectAxe();
  });

  const getToContactPage = () => {
    // start form
    cy.get('.vads-c-action-link--green')
      .first()
      .click();

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${NOD_BASE_URL}/veteran-details`);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    // Homeless question
    cy.location('pathname').should('eq', `${NOD_BASE_URL}/homeless`);
    cy.get('[type="radio"][value="N"]').check({ ...checkOpt, force: true });
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();
  };

  it('should edit info on a new page & cancel returns to contact info page', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
    cy.injectAxe();
    cy.axeCheck();

    // Mobile phone loops *****
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should(
      'eq',
      `${MAIN_CONTACT_PATH}/edit-mobile-phone`,
    );
    cy.injectAxe();
    cy.axeCheck();

    // cancel phone change
    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // update phone
    /*
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should('eq', `${MAIN_CONTACT_PATH}/edit-mobile-phone`);
    cy.findByLabelText(/extension/i)
      .clear()
      .type('12345');
    cy.findByText(/^update$/i, { selector: 'button' })
      .first()
      .click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
    */

    // Email loops *****
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should(
      'eq',
      `${MAIN_CONTACT_PATH}/edit-email-address`,
    );
    cy.injectAxe();
    cy.axeCheck();

    // cancel email change
    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // update email
    /*
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should('eq', `${MAIN_CONTACT_PATH}/edit-email-address`);
    cy.findByLabelText(/email address/i)
      .clear()
      .type('test@test.com');
    cy.findByText(/^update$/i, { selector: 'button' })
      .first()
      .click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);
    */

    // Mailing address loops *****
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should(
      'eq',
      `${MAIN_CONTACT_PATH}/edit-mailing-address`,
    );
    cy.injectAxe();
    cy.axeCheck();

    // cancel address change
    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // update address
    /*
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should('eq', `${MAIN_CONTACT_PATH}/edit-mailing-address`);
    cy.findByLabelText(/address line 2/i).clear(); // remove "c/o Pixar"
    cy.findByText(/^update$/i, { selector: 'button' })
      .first()
      .click();
    cy.wait('@getAddressValidation');
    */
    /*
    Not including address validation intermediate page because it hates me
    cy.findByText(/^use this address$/i, { selector: 'button' }).should('be.visible');
    cy.findByText(/^use this address$/i, { selector: 'button' })
      .first()
      .click();
    */
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
      .click({ waitForAnimations: true });

    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Skipping AXE-check; already done in previous test.
  });
});
