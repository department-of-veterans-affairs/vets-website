import { PROFILE_PATHS_LGBTQ_ENHANCEMENT } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import mockPersonalInformationEnhanced from '@@profile/tests/fixtures/personal-information-success-enhanced.json';
import mockServiceHistory from '@@profile/tests/fixtures/service-history-success.json';
import mockFullName from '@@profile/tests/fixtures/full-name-success.json';
import mockProfileEnhancementsToggles from '@@profile/tests/fixtures/personal-information-feature-toggles.json';
import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';

const setup = () => {
  cy.login(mockUser);
  cy.intercept(
    'v0/profile/personal_information',
    mockPersonalInformationEnhanced,
  );
  cy.intercept('v0/profile/service_history', mockServiceHistory);
  cy.intercept('v0/profile/full_name', mockFullName);
  cy.intercept('v0/feature_toggles*', mockProfileEnhancementsToggles);
  mockGETEndpoints(['v0/mhv_account', 'v0/ppiu/payment_information']);
  cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.PERSONAL_INFORMATION);
  cy.injectAxe();

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

describe('Content on the personal information page', () => {
  it('should render as expected', () => {
    setup();

    cy.findByText('Date of birth').should('exist');
    cy.findByText('May 6, 1986').should('exist');

    cy.findByText('Preferred name').should('exist');
    cy.findByText('Edit your profile to add a preferred name.').should('exist');

    cy.findByText('Pronouns').should('exist');
    cy.findByText('Edit your profile to add pronouns.').should('exist');

    cy.findByText('Sex assigned at birth').should('exist');
    cy.findByText('Male').should('exist');

    cy.findByText('Gender identity').should('exist');
    cy.findByText('Edit your profile to add a gender identity.').should(
      'exist',
    );

    cy.findByText('Sexual orientation').should('exist');
    cy.findByText('Edit your profile to add a sexual orientation.').should(
      'exist',
    );

    cy.axeCheck();
  });
});
