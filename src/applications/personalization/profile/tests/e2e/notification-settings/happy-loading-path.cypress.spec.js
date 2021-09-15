import { PROFILE_PATHS } from '@@profile/constants';

import { makeUserObject } from '~/applications/personalization/common/helpers';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';

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
      body: mockCommunicationPreferences,
    });
  });
  context(
    'when user is a VA patient at at least one facility that supports Rx tracking',
    () => {
      it('should show the Health Care group first and show the Rx tracking item along with the radio button hint text', () => {
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

        cy.findByText('503-555-1234').should('exist');
        // TODO: uncomment when email is a supported communication channel
        // cy.findByText('veteran@gmail.com').should('exist');
        cy.findAllByTestId('notification-group')
          .should('have.length', 3)
          .first()
          .should('contain.text', 'Your health care')
          .invoke('text')
          .should(
            'match',
            /Manage your health care email notifications on My HealtheVet/i,
          )
          .should('match', /prescription.*shipment/i)
          .should('match', /prescription.*tracking/i);
        cy.findAllByText(/^select an option/i).should('have.length', 1);
        cy.findAllByText(/check with your facility first/i).should(
          'have.length',
          1,
        );
      });
    },
  );
  context(
    'when user is a VA patient and is only associated with facilities that supports Rx tracking',
    () => {
      it('should show the Health Care group first and show the Rx tracking item but hide the radio button hint text', () => {
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

        cy.findByText('503-555-1234').should('exist');
        // TODO: uncomment when email is a supported communication channel
        // cy.findByText('veteran@gmail.com').should('exist');
        cy.findAllByTestId('notification-group')
          .should('have.length', 3)
          .first()
          .should('contain.text', 'Your health care')
          .invoke('text')
          .should(
            'match',
            /Manage your health care email notifications on My HealtheVet/i,
          )
          .should('match', /prescription.*shipment/i)
          .should('match', /prescription.*tracking/i);
        cy.findAllByText(/^select an option/i).should('have.length', 1);
        cy.findAllByText(/check with your facility first/i).should('not.exist');
      });
    },
  );
  context(
    'when user is a VA patient at a facility that does not support Rx tracking',
    () => {
      it('should show the Health Care group first but not show the Rx tracking item', () => {
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

        cy.findByText('503-555-1234').should('exist');
        // TODO: uncomment when email is a supported communication channel
        // cy.findByText('veteran@gmail.com').should('exist');
        cy.findAllByTestId('notification-group')
          .should('have.length', 3)
          .first()
          .should('contain.text', 'Your health care')
          .invoke('text')
          .should(
            'match',
            /Manage your health care email notifications on My HealtheVet/i,
          )
          .should('not.match', /prescription.*shipment/i)
          .should('not.match', /prescription.*tracking/i);
        cy.findAllByText(/^select an option/i).should('have.length', 1);
        cy.findAllByText(/check with your facility first/i).should('not.exist');
      });
    },
  );
  context('when user is not a VA patient', () => {
    it('should not show the Health Care notification group', () => {
      cy.login(makeUserObject({ isPatient: false }));
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByText('503-555-1234').should('exist');
      // uncomment when email is a supported communication channel
      // cy.findByText('veteran@gmail.com').should('exist');
      cy.findAllByTestId('notification-group')
        .should('have.length.above', 0)
        .each($el => {
          expect($el.text()).not.to.match(/your health care/i);
          expect($el.text()).not.to.match(
            /You can manage your health care email notifications through my healthevet/i,
          );
        });
    });
  });
});
