import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user-vap-error';
import mockPersonalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import mockServiceHistory from '@@profile/tests/fixtures/service-history-success.json';
import mockFullName from '@@profile/tests/fixtures/full-name-success.json';
import mockPaymentInfoNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import { mockFeatureToggles } from '../helpers';

const setup = () => {
  cy.login(mockUser);
  cy.intercept('v0/profile/personal_information', mockPersonalInformation);
  cy.intercept('v0/profile/service_history', mockServiceHistory);
  cy.intercept('v0/profile/full_name', mockFullName);
  cy.intercept('v0/ppiu/payment_information', mockPaymentInfoNotEligible);
  cy.intercept('v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
};

describe('When there is a known issue connecting to VA Profile', () => {
  it('should render the correct error alerts and not show contact info', () => {
    setup();
    // Top-level generic error alert should not be shown for this error
    cy.findByTestId('not-all-data-available-error').should('not.exist');

    // Contact info alert should be shown
    cy.findByTestId('service-is-down-banner').should('exist');

    // Check full name
    cy.findByText(/Wesley Watson Ford/i).should('exist');

    // Check service branch
    cy.findByText(/United States Air Force/i).should('exist');

    // Contact info sections should not be shown
    cy.findByText(/^Mailing address$/i).should('not.exist');
    cy.findByText(/^Residential address$/i).should('not.exist');
    cy.findByText(/^Phone numbers$/i).should('not.exist');
    cy.findByText(/^Learn how to verify your identity on VA.gov\?$/i).should(
      'not.exist',
    );
    cy.findByText(/^Contact email address$/i).should('not.exist');

    cy.injectAxeThenAxeCheck();
  });
});
