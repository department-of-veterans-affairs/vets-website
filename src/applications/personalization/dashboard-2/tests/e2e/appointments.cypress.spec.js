import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import MOCK_VA_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS';
import MOCK_CC_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS';

import moment from 'moment';
import { mockFeatureToggles } from './helpers';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';

const startOfToday = () =>
  moment()
    .startOf('day')
    .toISOString();

// Maximum number of days you can schedule an appointment in advance in VAOS
const endDate = () =>
  moment()
    .add(395, 'days')
    .startOf('day')
    .toISOString();

const VA_APPOINTMENTS_ENDPOINT = `vaos/v0/appointments?start_date=${startOfToday()}&end_date=${endDate()}&type=va`;
const CC_APPOINTMENTS_ENDPOINT = `vaos/v0/appointments?start_date=${startOfToday()}&end_date=${endDate()}&type=cc`;

const mockCCAppointmentsSuccess = () => {
  cy.intercept(CC_APPOINTMENTS_ENDPOINT, MOCK_CC_APPOINTMENTS);
};

const mockVAAppointmentsSuccess = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS);
};

describe('The My VA Dashboard - Appointments', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUser);
    mockFeatureToggles();
    cy.visit('my-va/');
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/evss_claims_async', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    mockVAAppointmentsSuccess();
    mockCCAppointmentsSuccess();
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
  });
  context('when it can show the next appointment', () => {
    it('when the next upcoming appointment is a community cares appointment', () => {
      // make sure that the Health care section is shown
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByRole('link', { name: /manage your appointments/i }).should(
        'exist',
      );
      cy.findByRole('heading', { name: /next appointment/i }).should('exist');

      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
