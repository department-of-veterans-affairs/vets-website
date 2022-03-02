import { PROFILE_PATHS_LGBTQ_ENHANCEMENT } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user';
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
};

const visitProfileAndCheckLoading = () => {
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
  it('should render personal information as expected', () => {
    setup();
    visitProfileAndCheckLoading();

    // Check preferred name
    cy.findByText('Wes').should('exist');

    // Check pronouns
    cy.findByText('He/him/his, They/them/theirs, Other/pronouns/here').should(
      'exist',
    );

    // Check gender identity
    cy.findByText('Man').should('exist');

    // Check sexual orientation
    cy.findByText('Straight or heterosexual, Some other orientation').should(
      'exist',
    );

    cy.axeCheck();
  });

  it('should render preferNotToAnswer for Sexual Orientation with correctly formatted string', () => {
    setup();

    cy.intercept('v0/profile/personal_information', {
      data: {
        attributes: {
          sexualOrientation: ['preferNotToAnswer'],
        },
      },
    });

    visitProfileAndCheckLoading();

    // Check sexual orientation
    cy.findByText('Prefer not to answer').should('exist');

    cy.axeCheck();
  });
});
