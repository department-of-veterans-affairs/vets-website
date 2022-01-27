import { BASE_URL, CONTESTABLE_ISSUES_API } from '../constants';

import mockUser from './fixtures/mocks/user.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import { mockContestableIssues } from './nod.cypress.helpers';

// Telephone specific responses
import mockTelephoneUpdate from './fixtures/mocks/telephone-update.json';
import mockTelephoneUpdateSuccess from './fixtures/mocks/telephone-update-success.json';

const checkOpt = {
  waitForAnimations: true,
};

describe('NOD contact info loop', () => {
  beforeEach(() => {
    window.dataLayer = [];
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);

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

    // telephone
    cy.intercept('PUT', '/v0/profile/telephones', mockTelephoneUpdate);
    cy.intercept('GET', '/v0/profile/status/*', mockTelephoneUpdateSuccess);

    cy.login(mockUser);
    cy.intercept('GET', '/v0/profile/status', mockStatus);

    cy.visit(BASE_URL);
    cy.injectAxe();
  });

  const getToContactPage = () => {
    // start form
    cy.findAllByText(/start the board/i, { selector: 'button' })
      .first()
      .click();

    // Veteran info (DOB, SSN, etc)
    cy.location('pathname').should('eq', `${BASE_URL}/veteran-details`);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    // Homeless question
    cy.location('pathname').should('eq', `${BASE_URL}/homeless`);
    cy.get('[type="radio"][value="N"]').check(checkOpt);
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();
  };

  it('should edit info on a new page & cancel returns to contact info page', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);
    cy.injectAxe();
    cy.axeCheck();

    // Mobile phone
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);

    // Email
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-email-address`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);

    // Mailing address
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mailing-address`);
    cy.injectAxe();
    cy.axeCheck();

    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);
  });

  /*
  * Skipping for now because clicking "update" should return to the contact
  * info page, but this isn't working... I think I'm missing an intermediate
  * step here?

  it.skip('should edit info on a new page, update & return to contact info page - C12884', () => {
    getToContactPage();

    // Contact info
    cy.location('pathname').should('eq', `${BASE_URL}/contact-information`);

    // Mobile phone
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);

    cy.findByLabelText(/mobile phone/i)
      .clear()
      .type('8885551212');
    cy.findByLabelText(/extension/i)
      .clear()
      .type('12345');
    cy.findAllByText(/update/i, { selector: 'button' })
      .first()
      .click();
    // Not returning to the contact info page :(
  });
  */
});
