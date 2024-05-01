import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = () => {
  cy.login(mockUser);
  mockGETEndpoints([
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/full_name',
    'v0/profile/ch33_bank_accounts',
    'v0/profile/status',
    'v0/mhv_account',
    'v0/ppiu/payment_information',
  ]);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // should show a loading indicator
  cy.get('va-loading-indicator').should('exist');
  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');
};

describe('Contact info fields', () => {
  it('should manage focus correctly when going into edit mode', () => {
    setup();
    cy.injectAxe();

    cy.findByRole('button', { name: /edit mailing address/i }).click();
    cy.get('va-checkbox[name="root_view:livesOnMilitaryBase"]').should(
      'be.focused',
    );
    cy.axeCheck();
    cy.get('va-button[text="Cancel"]').click();
    cy.findByRole('button', { name: /edit mailing address/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit home address/i }).click();
    cy.findByLabelText(/use my mailing address for my home address/i).should(
      'be.focused',
    );
    cy.axeCheck();
    cy.get('va-button[text="Cancel"]').click();
    cy.findByRole('button', { name: /edit home address/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit home.*number/i }).click();
    cy.findByTestId('homePhone').should('exist');
    cy.get('va-text-input[name="root_inputPhoneNumber"]').should('be.focused');
    cy.axeCheck();
    cy.get('va-button[text="Cancel"]').click();
    cy.findByRole('button', { name: /edit home.*number/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit work.*number/i }).click();
    cy.findByTestId('workPhone').should('exist');
    cy.axeCheck();
    cy.get('va-button[text="Cancel"]').click();
    cy.findByRole('button', { name: /edit work.*number/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit mobile.*number/i }).click();
    cy.findByTestId('mobilePhone').should('exist');
    cy.get('va-text-input[name="root_inputPhoneNumber"]').should('be.focused');
    cy.axeCheck();
    cy.get('va-button[text="Cancel"]').click();
    cy.findByRole('button', { name: /edit mobile.*number/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit contact email/i }).click();
    cy.findByTestId('email').should('exist');
    cy.get('va-text-input[name="root_emailAddress"]').should('be.focused');
    cy.axeCheck();
    cy.get('va-button[text="Cancel"]').click();
    cy.findByRole('button', { name: /edit contact email/i }).should(
      'be.focused',
    );
  });
});
