/**
 * [TestRail-integrated] Spec for Higher Level Review - Wizard
 * @testrailinfo projectId 5
 * @testrailinfo suiteId 6
 * @testrailinfo groupId 3256
 * @testrailinfo runName HLR-e2e-ContactLoop
 */
import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import {
  BASE_URL,
  CONTESTABLE_ISSUES_API,
  CONTACT_INFO_PATH,
} from '../constants';

import mockV2Data from './fixtures/data/maximal-test-v2.json';
import cypressSetup from '../../shared/tests/cypress.setup';

import mockTelephoneUpdate from '../../shared/tests/fixtures/mocks/profile-telephone-update.json';
import mockTelephoneUpdateSuccess from '../../shared/tests/fixtures/mocks/profile-telephone-update-success.json';

describe('HLR contact info loop', () => {
  Cypress.config({ requestTimeout: 10000 });
  const MAIN_CONTACT_PATH = `${BASE_URL}/${CONTACT_INFO_PATH}`;

  beforeEach(() => {
    cypressSetup();

    window.dataLayer = [];
    setStoredSubTask({ benefitType: 'compensation' });

    cy.intercept('GET', `/v1${CONTESTABLE_ISSUES_API}compensation`, []).as(
      'getIssues',
    );
    cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockV2Data);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockV2Data);

    cy.intercept('PUT', '/v0/profile/telephones', mockTelephoneUpdate);
    cy.intercept('GET', '/v0/profile/status/*', mockTelephoneUpdateSuccess);

    cy.visit(BASE_URL);
    cy.injectAxe();
  });

  const getToContactPage = () => {
    // start form
    cy.findAllByText(/start the request/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${BASE_URL}/veteran-information`);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    // Homeless question
    cy.location('pathname').should('eq', `${BASE_URL}/homeless`);
    cy.get(`va-radio-option[value="N"]`).click();
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();
  };

  it('should edit info on a new page & cancel returns to contact info page - C12883', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);
    cy.injectAxe();
    cy.axeCheck();

    // Mobile phone
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-mobile-phone`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);

    // Email
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-email-address`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);

    // Mailing address
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-mailing-address`,
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('va-button[text="Cancel"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should edit info on a new page, update & return to contact info page - C12884', () => {
    getToContactPage();

    // Mobile phone
    cy.get('a[href$="mobile-phone"]').click();
    cy.contains('Edit mobile phone').should('be.visible');
    cy.location('pathname').should(
      'eq',
      `${BASE_URL}/contact-information/edit-mobile-phone`,
    );

    cy.get('va-text-input[value="5109224444"]');

    cy.findAllByText(/save/i, { selector: 'button' })
      .first()
      .click();

    cy.location('pathname').should('eq', MAIN_CONTACT_PATH);

    // Skipping AXE-check; already done in previous test.
  });
});
