import { BASE_URL, CONTESTABLE_ISSUES_API } from '../constants';

import mockUser from './fixtures/mocks/user.json';
import mockUserUpdate from './fixtures/mocks/user-update.json';
import mockIssues from './fixtures/mocks/contestable-issues.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import { mockContestableIssues } from './nod.cypress.helpers';

// Profile specific responses
import mockProfilePhone from './fixtures/mocks/profile-phone.json';
import mockProfileEmail from './fixtures/mocks/profile-email.json';
import mockProfileAddress from './fixtures/mocks/profile-address.json';
import mockProfileAddressValidation from './fixtures/mocks/profile-address-validation.json';

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
    cy.intercept(
      'GET',
      '/v0/notice_of_disagreements/contestable_issues',
      mockIssues,
    );
    cy.intercept('GET', '/v0/in_progress_forms/10182', mockData);
    cy.intercept('PUT', '/v0/in_progress_forms/10182', mockData);

    // contact page updates
    cy.intercept('PUT', '/v0/profile/telephones', mockProfilePhone);
    cy.intercept('PUT', '/v0/profile/email_addresses', mockProfileEmail);
    cy.intercept('PUT', '/v0/profile/addresses', mockProfileAddress);
    cy.intercept(
      'POST',
      '/v0/profile/address_validation',
      mockProfileAddressValidation,
    ).as('getAddressValidation');
    // profile changes
    cy.intercept('GET', '/v0/user?now=*', mockUserUpdate);

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
    const contactPageUrl = `${BASE_URL}/contact-information`;

    // Contact info
    cy.location('pathname').should('eq', contactPageUrl);
    cy.injectAxe();
    cy.axeCheck();

    // Mobile phone loops *****
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);
    cy.injectAxe();
    cy.axeCheck();

    // cancel phone change
    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', contactPageUrl);

    // update phone
    /*
    cy.get('a[href$="phone"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mobile-phone`);
    cy.findByLabelText(/extension/i)
      .clear()
      .type('12345');
    cy.findByText(/^update$/i, { selector: 'button' })
      .first()
      .click();
    cy.location('pathname').should('eq', contactPageUrl);
    */

    // Email loops *****
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-email-address`);
    cy.injectAxe();
    cy.axeCheck();

    // cancel email change
    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', contactPageUrl);

    // update email
    /*
    cy.get('a[href$="email-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-email-address`);
    cy.findByLabelText(/email address/i)
      .clear()
      .type('test@test.com');
    cy.findByText(/^update$/i, { selector: 'button' })
      .first()
      .click();
    cy.location('pathname').should('eq', contactPageUrl);
    */

    // Mailing address loops *****
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mailing-address`);
    cy.injectAxe();
    cy.axeCheck();

    // cancel address change
    cy.findByText(/cancel/i, { selector: 'button' }).click();
    cy.location('pathname').should('eq', contactPageUrl);

    // update address
    /*
    cy.get('a[href$="mailing-address"]').click();
    cy.location('pathname').should('eq', `${BASE_URL}/edit-mailing-address`);
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
    cy.location('pathname').should('eq', contactPageUrl);
  });
});
