import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';

const setup = () => {
  cy.login(mockUser);
  mockGETEndpoints([
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/full_name',
    'v0/profile/ch33_bank_accounts',
    'v0/profile/status',
    'v0/mhv_account',
    'v0/feature_toggles*',
    'v0/ppiu/payment_information',
  ]);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

describe('Contact info fields', () => {
  it('should manage focus correctly when going into edit mode', () => {
    setup();
    cy.injectAxe();

    cy.findByRole('button', { name: /edit mailing address/i }).click();
    cy.findByLabelText(/I live on a.*military base/i).should('be.focused');
    cy.axeCheck();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.findByRole('button', { name: /edit mailing address/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit home address/i }).click();
    cy.findByLabelText(/my home address is the same/i).should('be.focused');
    cy.axeCheck();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.findByRole('button', { name: /edit home address/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit home.*number/i }).click();
    cy.findByLabelText(/home.*number/i).should('be.focused');
    cy.axeCheck();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.findByRole('button', { name: /edit home.*number/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit work.*number/i }).click();
    cy.findByLabelText(/work.*number/i).should('be.focused');
    cy.axeCheck();
    cy.findByRole('button', { name: /cancel/i }).click();
    // We have to click the cancel button twice because the work number input is
    // empty. Since that field is given focus and it is a required field, once
    // you blur the input, form validation is triggered and results in a
    // validation error.
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.findByRole('button', { name: /edit work.*number/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit mobile.*number/i }).click();
    cy.findByLabelText(/mobile.*number/i).should('be.focused');
    cy.axeCheck();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.findByRole('button', { name: /edit mobile.*number/i }).should(
      'be.focused',
    );

    cy.findByRole('button', { name: /edit contact email/i }).click();
    cy.findByLabelText(/email address/i).should('be.focused');
    cy.axeCheck();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.findByRole('button', { name: /edit contact email/i }).should(
      'be.focused',
    );
  });
});
