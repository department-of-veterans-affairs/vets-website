import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';
import { makeMockUser } from '../../fixtures/users/user';
import { mockNotificationSettingsAPIs } from '../helpers';
import mockFeatureToggles from './feature-toggles.json';

function notificationSettingsSectionIsAvailable(user) {
  cy.login(user);
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
}

function notificationSettingsSectionIsBlocked(user) {
  cy.login(user);
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
}

describe('Notification Settings', () => {
  const patientWithClaimsAndAppeals = makeMockUser();
  const nonPatientWithoutClaimsOrAppeals = makeMockUser({
    isPatient: false,
    services: [
      'edu-benefits',
      'facilities',
      'form-prefill',
      'form-save-in-progress',
      'form526',
      'hca',
      'id-card',
      'identity-proofed',
      'mhv-accounts',
      'user-profile',
      'vet360',
    ],
  });
  beforeEach(() => {
    mockNotificationSettingsAPIs();
  });
  context('when the feature flag is turned on', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    });
    context('and user is a patient with the claims and appeals service', () => {
      it('is available in the side nav and the section loads', () => {
        notificationSettingsSectionIsAvailable(patientWithClaimsAndAppeals);
      });
    });
    // NOTE: For the initial release, the Notification Settings page will only
    // be shown if the user is determined to be a VA patient or if they have
    // either the `appeals-status` or `evss-claims` service.
    //
    // NOTE: This is because the only notification settings that will exist at
    // launch apply to health care or claims and there is no reason to show the
    // section to Veterans who don't have health care or have claims or appeals.
    context(
      'and user is not a patient and lacks both the claims and appeals service',
      () => {
        it('is not available in the side nav and the path redirects to the personal info section', () => {
          notificationSettingsSectionIsBlocked(
            nonPatientWithoutClaimsOrAppeals,
          );
        });
      },
    );
  });
  context('when the feature flag is turned off', () => {
    it('is not available in the side nav and the path redirects to the personal info section', () => {
      notificationSettingsSectionIsBlocked(patientWithClaimsAndAppeals);
    });
  });
});
