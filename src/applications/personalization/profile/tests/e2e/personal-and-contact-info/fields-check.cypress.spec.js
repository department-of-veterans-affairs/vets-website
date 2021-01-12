import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import mockPersonalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import mockServiceHistory from '@@profile/tests/fixtures/service-history-success.json';
import mockFullName from '@@profile/tests/fixtures/full-name-success.json';

const setup = () => {
  disableFTUXModals();
  cy.login(mockUser);
  cy.route('GET', 'v0/profile/personal_information', mockPersonalInformation);
  cy.route('GET', 'v0/profile/service_history', mockServiceHistory);
  cy.route('GET', 'v0/profile/full_name', mockFullName);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

describe('Content on the personal information section in the profile', () => {
  it('should render as expected', () => {
    setup();
    // Check full name
    cy.findByText(/Wesley Watson Ford/i).should('exist');

    // Check service branch
    cy.findByText(/United States Air Force/i).should('exist');

    // Check date of birth
    cy.findByText(/May 6, 1986/i).should('exist');

    // Check gender
    cy.findByText(/Male/i).should('exist');

    // Check mailing address
    cy.get('div[data-field-name="mailingAddress"]')
      .contains(/1493 Martin Luther King Rd, Apt 1/i)
      .should('exist');

    cy.get('div[data-field-name="mailingAddress"]')
      .contains(/Fulton, NY 97062/i)
      .should('exist');

    // Check home address
    cy.get('div[data-field-name="residentialAddress"]')
      .contains(/PSC 808 Box 37/i)
      .should('exist');

    // Check home phone number
    cy.get('div[data-field-name="homePhone"]')
      .contains(/503-222-2222, ext. 0000/i)
      .should('exist');

    // Check mobile phone number
    cy.get('div[data-field-name="mobilePhone"]')
      .contains(/503-555-1234, ext. 0000/i)
      .should('exist');

    // Check email
    cy.get('div[data-field-name="email"]')
      .contains(/veteran@gmail.com/i)
      .should('exist');
  });
});
