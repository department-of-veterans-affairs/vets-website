import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';
import mockProfileShowAddressChangeModalToggle from '@@profile/tests/fixtures/contact-information-feature-toggles.json';

const setup = (mobile = false) => {
  if (mobile) {
    cy.viewport('iphone-4');
  }

  cy.login(mockUser);

  cy.intercept('v0/feature_toggles*', mockProfileShowAddressChangeModalToggle);

  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/ppiu/payment_information',
  ]);

  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  cy.injectAxe();

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

describe('The personal and contact information page', () => {
  it('should show address update modal dialog when updating home address', () => {
    setup();

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit home address`, 'i'),
    }).click({
      force: true,
    });

    cy.findByTestId('save-edit-button')
      .should('exist')
      .click();

    cy.findByTestId('modal-content').should('exist');

    cy.axeCheck();
  });
});
