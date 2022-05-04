import { mockUser } from '@@profile/tests/fixtures/users/user';

import { v2 } from '../../../mocks/appointments';
import { generateFeatureToggles } from '../../../mocks/feature-toggles';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

import moment from '~/applications/personalization/dashboard/lib/moment-tz';

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
  it('Has an appointment in the next 30 days', () => {
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      expect(req.query.start).to.equal(
        moment()
          .startOf('day')
          .toISOString(),
      );
      // and the end to be 395 days from today
      expect(req.query.end).to.equal(
        moment()
          .add(395, 'days')
          .startOf('day')
          .toISOString(),
      );
      expect(req.query._include).to.include('facilities');
      expect(req.query.status).to.include('booked');
      const rv = v2.createAppointmentSuccess();
      req.reply(rv);
    });

    cy.visit('my-va/');
    cy.injectAxeThenAxeCheck();
    // // make sure that the Health care section is shown
    cy.findByTestId('dashboard-section-health-care').should('exist');
    cy.findByRole('link', { name: /manage your appointments/i }).should(
      'exist',
    );
    cy.findByRole('heading', { name: /next appointment/i }).should('exist');
  });

  it('Has apppintments, but not in 30 days', () => {
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      // TODO: check for incoming params
      const rv = v2.createAppointmentSuccess({ startsInDays: [31] });
      req.reply(rv);
    });
    cy.visit('my-va/');
    cy.injectAxeThenAxeCheck();
    // make sure that the Health care section is shown
    cy.findByTestId('dashboard-section-health-care').should('exist');
    cy.findByTestId('no-appointment-message').should('exist');
  });
  it('Has no appointments', () => {
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      // TODO: check for incoming params
      const rv = v2.createAppointmentSuccess({ startsInDays: [] });
      req.reply(rv);
    });
    cy.visit('my-va/');
    cy.injectAxeThenAxeCheck();
    // make sure that the Health care section is shown
    cy.findByTestId('dashboard-section-health-care').should('exist');
    cy.findByTestId('no-appointment-message').should('exist');

    // make the a11y check
    cy.injectAxeThenAxeCheck();
  });
});
