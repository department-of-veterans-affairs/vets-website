/**
 * [TestRail-integrated] Spec for Notification Prefs > Select options alert
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 2426
 * @testrailinfo runName NP-e2e-Select-options-alert
 */

import { PROFILE_PATHS } from '@@profile/constants';

import { makeMockUser } from '@@profile/tests/fixtures/users/user';
import mockCommPrefsNoSelectionsMade from '@@profile/tests/fixtures/communication-preferences/get-200-maximal-no-selections.json';
import mockCommPrefsAllSelectionsMade from '@@profile/tests/fixtures/communication-preferences/get-200-maximal-all-selections.json';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

import mockFeatureToggles from './feature-toggles.json';

registerCypressHelpers();

describe('Notification Settings', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommPrefsNoSelectionsMade,
    });
  });
  context('when user has not made any selections', () => {
    context(
      'and is a VA patient, has an email address, and a mobile phone number',
      () => {
        it('should show the "select options" alert and the jump link should work - C9530', () => {
          const patientWithAllContactInfoOnFile = makeMockUser();
          cy.login(patientWithAllContactInfoOnFile);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

          // now find the
          cy.findByRole('heading', {
            name: /select your notification options/i,
          }).should('exist');
          cy.findByRole('link', {
            name: /select your notification options/i,
          }).click();
        });
      },
    );
  });
  context('when user has opted into all notifications', () => {
    context(
      'and is a VA patient, has an email address, and a mobile phone number',
      () => {
        it('should not show the "select options" alert - C9531', () => {
          cy.intercept('GET', '/v0/profile/communication_preferences', {
            statusCode: 200,
            body: mockCommPrefsAllSelectionsMade,
          });
          const patientWithAllContactInfoOnFile = makeMockUser();
          cy.login(patientWithAllContactInfoOnFile);
          cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

          cy.loadingIndicatorWorks();

          // now find the
          cy.findByRole('heading', {
            name: /select your notification options/i,
          }).should('not.exist');
          cy.findByRole('link', {
            name: /select your notification options/i,
          }).should('not.exist');
        });
      },
    );
  });
});
