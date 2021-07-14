import { PROFILE_PATHS } from '@@profile/constants';

import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import mockNonPatient from '@@profile/tests/fixtures/users/user-non-patient.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';

import { registerCypressHelpers } from '../helpers';

import mockFeatureToggles from './feature-toggles.json';

registerCypressHelpers();

describe.skip('Notification Settings', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
  });
  context('when user is a VA patient', () => {
    it('should show the notification preferences groups with Health Care first', () => {
      cy.login(mockPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByText('555-555-5559').should('exist');
      cy.findByText('alongusername@domain.com').should('exist');
      cy.findAllByTestId('notification-group')
        .first()
        .should('contain.text', 'Your health care');
    });
  });
  context('when user is not a VA patient', () => {
    it('should not show the Health Care notification group', () => {
      cy.login(mockNonPatient);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByText('555-555-5559').should('exist');
      cy.findByText('alongusername@domain.com').should('exist');
      cy.findAllByTestId('notification-group').should('have.length.above', 0);
      cy.findAllByTestId('notification-group')
        .first()
        .should('not.contain.text', 'Your health care');
    });
  });
});
