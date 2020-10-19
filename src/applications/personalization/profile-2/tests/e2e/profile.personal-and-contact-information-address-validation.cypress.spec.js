import { PROFILE_PATHS } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';
import mockPersonalInformation from '../fixtures/personal-information-success.json';
import mockServiceHistory from '../fixtures/service-history-success.json';
import mockFullName from '../fixtures/full-name-success.json';

const setup = () => {
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

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

describe('Addresses in the address validation modal on the profile', () => {
  it('should render as expected', () => {
    setup();

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit mailing address`, 'i'),
    }).click({
      force: true,
    });

    // Update address
    cy.get(`#root_addressLine3`)
      .click()
      .type('Addition to Address');

    cy.findAllByText(/Update/)
      .first()
      .click();

    // Ensure correct addresses show up
    cy.findByText(
      /1493 Martin Luther King Rd, Apt 1, Addition to Address/i,
    ).should('exist');

    cy.findByText(/400 NW 65th St/i).should('exist');

    cy.findAllByText(/Update/)
      .first()
      .click();
  });
});
