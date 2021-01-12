import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user-vap-error.js';
import mockPersonalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import mockServiceHistory from '@@profile/tests/fixtures/service-history-success.json';
import mockFullName from '@@profile/tests/fixtures/full-name-success.json';
import mockPaymentInfoNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';

const setup = () => {
  disableFTUXModals();

  cy.login(mockUser);
  cy.route('GET', 'v0/profile/personal_information', mockPersonalInformation);
  cy.route('GET', 'v0/profile/service_history', mockServiceHistory);
  cy.route('GET', 'v0/profile/full_name', mockFullName);
  cy.route('GET', 'v0/ppiu/payment_information', mockPaymentInfoNotEligible);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

describe('When there is a known issue connecting to VA Profile', () => {
  it('should render the correct error alerts and not show contact info', () => {
    setup();
    // Top-level generic error alert should not be shown for this error
    cy.findByTestId('not-all-data-available-error').should('not.exist');

    // Contact info alert should be shown
    cy.findByTestId('vap-service-not-available-error').should('exist');

    // Check full name
    cy.findByText(/Wesley Watson Ford/i).should('exist');

    // Check service branch
    cy.findByText(/United States Air Force/i).should('exist');

    // Check date of birth
    cy.findByText(/May 6, 1986/i).should('exist');

    // Check gender
    cy.findByText(/Male/i).should('exist');

    // Contact info sections should not be shown
    cy.findByText(/^Mailing address$/i).should('not.exist');
    cy.findByText(/^Residential address$/i).should('not.exist');
    cy.findByText(/^Phone numbers$/i).should('not.exist');
    cy.findByText(/^How will you use my contact information\?$/i).should(
      'not.exist',
    );
    cy.findByText(/^Contact email address$/i).should('not.exist');
  });
});
