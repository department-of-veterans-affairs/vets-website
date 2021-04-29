import moment from 'moment';
import { mockFeatureToggles } from './helpers';
import { mockUser } from '@@profile/tests/fixtures/users/user.js';

import ERROR_400 from '~/applications/personalization/dashboard-2/utils/mocks/ERROR_400.js';
import PARTIAL_ERROR from '~/applications/personalization/dashboard-2/utils/mocks/appointments/MOCK_VA_APPOINTMENTS_PARTIAL_ERROR.js';
import MOCK_FACILITIES from '~/applications/personalization/dashboard-2/utils/mocks/appointments/MOCK_FACILITIES.json';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import {
  upcomingCCAppointment,
  upcomingVAAppointment,
} from '~/applications/personalization/dashboard-2/utils/appointments.js';

const alertText = /Something went wrong on our end, and we can’t access your appointment information/i;
const startOfToday = moment()
  .startOf('day')
  .toISOString();

// Maximum number of days you can schedule an appointment in advance in VAOS
const endDate = moment()
  .add(395, 'days')
  .startOf('day')
  .toISOString();

describe('MyVA Dashboard - Appointments', () => {
  describe('when there is a 400 error fetching VA appointments', () => {
    it('should show the appointments error alert', () => {
      mockLocalStorage();
      cy.login(mockUser);
      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=va`,
        ERROR_400,
      );

      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=cc`,
        upcomingCCAppointment,
      );

      cy.intercept('GET', `vaos/v1/facilities/va?ids=*`, MOCK_FACILITIES);

      mockFeatureToggles();
      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
    });
  });

  describe('when there is a 400 error fetching CC appointments', () => {
    it('should show the appointments error alert', () => {
      mockLocalStorage();
      cy.login(mockUser);
      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=va`,
        upcomingVAAppointment,
      );

      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=cc`,
        ERROR_400,
      );

      cy.intercept('GET', `vaos/v1/facilities/va?ids=*`, MOCK_FACILITIES);

      mockFeatureToggles();
      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
    });
  });

  describe('when there is a partial error fetching VA appointments', () => {
    it('should show the appointments error alert', () => {
      mockLocalStorage();
      cy.login(mockUser);
      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=va`,
        PARTIAL_ERROR,
      );

      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=cc`,
        upcomingCCAppointment,
      );

      cy.intercept('GET', `vaos/v1/facilities/va?ids=*`, MOCK_FACILITIES);

      mockFeatureToggles();
      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
    });
  });

  describe('when there is an error fetching facilities', () => {
    it('should show the appointments error alert', () => {
      mockLocalStorage();
      cy.login(mockUser);
      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=va`,
        upcomingVAAppointment,
      );

      cy.intercept(
        'GET',
        `vaos/v0/appointments?start_date=${startOfToday}&end_date=${endDate}&type=cc`,
        upcomingCCAppointment,
      );

      cy.intercept('GET', `vaos/v1/facilities/va?ids=*`, ERROR_400);

      mockFeatureToggles();
      cy.visit('my-va/');
      cy.findByText(
        'We can’t access any claims or appeals information right now',
      ).should('exist');
    });
  });
});
