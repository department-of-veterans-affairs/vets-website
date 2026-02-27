/**
 * [TestRail-integrated] Spec for Notification Prefs > Happy loading path
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 2404
 * @testrailinfo runName NP-e2e-Happy-loading-path
 */

import { PROFILE_PATHS } from '@@profile/constants';

import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { makeUserObject } from '~/applications/personalization/common/helpers';

import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

registerCypressHelpers();

describe('Notification Settings', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
      delay: 2000,
    });
  });
  context(
    'when user is a VA patient at at least one facility that supports Rx tracking',
    () => {
      it('should show the Rx tracking item - C9477', () => {
        cy.login(
          makeUserObject({
            isPatient: true,
            // 983 supports Rx-tracking, 123 does not
            facilities: [{ facilityId: '983' }, { facilityId: '123' }],
          }),
        );
        cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
        cy.findByRole('heading', {
          name: 'Notification settings',
          level: 1,
        }).should('exist');

        cy.loadingIndicatorWorks();

        cy.findByTestId('mobile-phone-number-on-file').should('exist');

        cy.findByTestId('mobile-phone-number-on-file')
          .shadow()
          .findByText(/503-555-1234/i)
          .should('exist');

        // TODO: uncomment when email is a supported communication channel
        // cy.findByText('veteran@gmail.com').should('exist');
        cy.findAllByTestId('notification-group').should('have.length', 3);
        cy.get('[data-testid="checkbox-group-item4"]')
          .shadow()
          .invoke('text')
          .should('match', /prescription.*shipment/i)
          .should('match', /prescription.*tracking/i);
        cy.injectAxeThenAxeCheck();
      });
    },
  );
  context(
    'when user is a VA patient and is only associated with facilities that supports Rx tracking',
    () => {
      it('should show the Rx tracking item but hide the radio button hint text - C9478', () => {
        cy.login(
          makeUserObject({
            isPatient: true,
            // both 983 and 554 support Rx tracking
            facilities: [{ facilityId: '983' }, { facilityId: '554' }],
          }),
        );
        cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
        cy.findByRole('heading', {
          name: 'Notification settings',
          level: 1,
        }).should('exist');

        cy.loadingIndicatorWorks();

        cy.findByTestId('mobile-phone-number-on-file')
          .shadow()
          .findByText(/503-555-1234/i)
          .should('exist');
        // TODO: uncomment when email is a supported communication channel
        // cy.findByText('veteran@gmail.com').should('exist');
        cy.findAllByTestId('notification-group').should('have.length', 3);
        cy.get('[data-testid="checkbox-group-item4"]')
          .shadow()
          .invoke('text')
          .should('match', /prescription.*shipment/i)
          .should('match', /prescription.*tracking/i);
        cy.findAllByText(/check with your VA pharmacy first/i).should(
          'not.exist',
        );
        cy.injectAxeThenAxeCheck();
      });
    },
  );
  context(
    'when user is a VA patient at a facility that does not support Rx tracking',
    () => {
      it('should not show the Rx tracking item - C9479', () => {
        cy.login(
          makeUserObject({
            isPatient: true,
            facilities: [{ facilityId: '123' }],
          }),
        );
        cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
        cy.findByRole('heading', {
          name: 'Notification settings',
          level: 1,
        }).should('exist');

        cy.loadingIndicatorWorks();

        cy.findByTestId('mobile-phone-number-on-file')
          .shadow()
          .findByText(/503-555-1234/i)
          .should('exist');
        // TODO: uncomment when email is a supported communication channel
        // cy.findByText('veteran@gmail.com').should('exist');
        cy.findAllByTestId('notification-group')
          .should('have.length', 3)
          .invoke('text')
          .should('not.match', /prescription.*shipment/i)
          .should('not.match', /prescription.*tracking/i);
        cy.findAllByText(/check with your VA pharmacy first/i).should(
          'not.exist',
        );
        cy.injectAxeThenAxeCheck();
      });
    },
  );
  context('when user is not a VA patient', () => {
    it('should not show the Health Care notification group - C9480', () => {
      cy.login(makeUserObject({ isPatient: false }));
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByTestId('mobile-phone-number-on-file')
        .shadow()
        .findByText(/503-555-1234/i)
        .should('exist');
      // uncomment when email is a supported communication channel
      // cy.findByText('veteran@gmail.com').should('exist');
      cy.findAllByTestId('notification-group')
        .should('have.length.above', 0)
        .each($el => {
          expect($el.text()).not.to.match(/your health care/i);
        });
      cy.injectAxeThenAxeCheck();
    });
  });
});
