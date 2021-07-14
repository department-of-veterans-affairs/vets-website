import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import { mockUser as mockUserVAPError } from '@@profile/tests/fixtures/users/user-vap-error.js';
import error500 from '@@profile/tests/fixtures/500.json';

import { registerCypressHelpers } from '../helpers';

import mockFeatureToggles from './feature-toggles.json';

registerCypressHelpers();

describe.skip('Notification Settings - Load Errors', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
  });
  context('when VA Profile contact info is not available', () => {
    it('should show an error message and not even try to fetch current notification preferences', () => {
      const getCommPrefsStub = cy.stub();
      cy.intercept('GET', 'v0/profile/communication_preferences', () => {
        getCommPrefsStub();
      });

      cy.login(mockUserVAPError);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');
      cy.findByText(/We can’t access your.*settings at this time\./i).should(
        'exist',
      );
      cy.should(() => {
        expect(getCommPrefsStub).not.to.be.called;
      });
      cy.findAllByTestId('notification-group').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
  context('when we cannot fetch current notification preferences', () => {
    it('should show an error message', () => {
      cy.intercept('GET', 'v0/profile/communication_preferences', {
        statusCode: 500,
        data: error500,
      });
      cy.login(mockUser);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();
      // and an error message appears
      cy.findByText(/We can’t access your.*settings at this time\./i).should(
        'exist',
      );
      cy.findAllByTestId('notification-group').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
