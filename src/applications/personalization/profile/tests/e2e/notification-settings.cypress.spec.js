import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import error500 from '@@profile/tests/fixtures/500.json';

import { mockUser } from '../fixtures/users/user';
import { mockFeatureToggles } from './helpers';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

describe('Notification Settings', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    // Explicitly mocking these APIs as failures, causes the tests to run faster
    cy.intercept('/v0/profile/personal_information', error500);
    cy.intercept('/v0/profile/ch33_bank_accounts', error500);
    cy.intercept('/v0/ppiu/payment_information', error500);
    cy.intercept('/v0/mhv_account', error500);
  });
  context('when the feature flag is turned on', () => {
    it('is available in the side nav and the section loads', () => {
      mockFeatureToggles();
      // go to the root of the Profile
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      // click on the Notification settings item in the side nav
      cy.findByRole('link', {
        name: PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS,
      }).click();
      // make sure the url is correct
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.NOTIFICATION_SETTINGS}`,
      );
      // make sure the page loads
      cy.findByRole('heading', {
        name: PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS,
      });
    });
  });
  context('when the feature flag is turned off', () => {
    it('is not available in the side nav and the path redirects to the personal info section', () => {
      // go to the root of the Profile
      cy.visit(PROFILE_PATHS.PROFILE_ROOT);
      // this assertion is only here to make sure the following "not.exist" does
      // not pass as a false positive. i.e., we need to make sure the side nav
      // is visible before we check to make sure a particular element does not
      // exist in the side nav
      cy.findByRole('link', {
        name: PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
      }).should('exist');
      // make sure there is no Notification settings item in the side nav
      cy.findByRole('link', {
        name: PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS,
      }).should('not.exist');
      // try to go directly to the Notification settings URL
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      // make sure the user is directed back to the root of the Profile
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
      );
    });
  });
});
