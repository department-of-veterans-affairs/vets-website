import { mockUser } from '@@profile/tests/fixtures/users/user';

import { v2 } from '../../../mocks/appointments';
import { generateFeatureToggles } from '../../../mocks/feature-toggles';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

const alertText = /Something went wrong on our end, and we can’t access your appointment information/i;

const VA_V2_APPOINTMENTS_ENDPOINT = `vaos/v2/appointments*`;

describe('MyVA Dashboard - Appointments - v2', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUser);
    cy.intercept(
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileUseVaosV2Api: true,
      }),
    );
  });
  context('when there is a 500 error fetching  appointments', () => {
    it('should show the appointments error alert and never call the facilities API - C15725', () => {
      cy.intercept('GET', VA_V2_APPOINTMENTS_ENDPOINT, {
        statusCode: 500,
        body: v2.createVaosError({ status: 500, title: 'error' }),
      });

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when there is a 400 error fetching  appointments', () => {
    it('should show the appointments error alert and never call the facilities API - C15726', () => {
      cy.intercept('GET', VA_V2_APPOINTMENTS_ENDPOINT, {
        statusCode: 400,
        body: v2.createVaosError({ status: 400, title: 'error' }),
      });

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
});
