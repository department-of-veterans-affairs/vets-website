/**
 * [TestRail-integrated] Spec for My VA (Dashboard) - Appointments
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 4033
 * @testrailinfo runName MyVA-e2e-Appts
 */
import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import moment from 'moment';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import MOCK_VA_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS';
import MOCK_VA_APPOINTMENTS_EMPTY from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS_EMPTY';
import MOCK_VA_APPOINTMENTS_OVER_30_DAYS from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS_OVER_30_DAYS';
import MOCK_CC_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS';
import MOCK_CC_APPOINTMENTS_EMPTY from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS_EMPTY';
import MOCK_CC_APPOINTMENTS_OVER_30_DAYS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS_OVER_30_DAYS';

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

const mockCCAppointmentsEmpty = () => {
  cy.intercept(CC_APPOINTMENTS_ENDPOINT, MOCK_CC_APPOINTMENTS_EMPTY);
};

const mockCCAppointmentsPast30Days = () => {
  cy.intercept(CC_APPOINTMENTS_ENDPOINT, MOCK_CC_APPOINTMENTS_OVER_30_DAYS);
};

const mockVAAppointmentsSuccess = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS);
};

const mockVAAppointmentsEmpty = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS_EMPTY);
};

const mockVAAppointmentsPast30Days = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS_OVER_30_DAYS);
};

describe('The My VA Dashboard - Appointments', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUser);
    cy.visit('my-va/');
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/evss_claims_async', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
  });
  context('when the next appointment is within 30 days', () => {
    it('when the next upcoming appointment is a community cares appointment - C15731', () => {
      mockVAAppointmentsSuccess();
      mockCCAppointmentsSuccess();
      // make sure that the Health care section is shown
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByRole('link', { name: /manage your appointments/i }).should(
        'exist',
      );
      cy.findByRole('heading', { name: /next appointment/i }).should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
  context('when the next appointment is over 30 days', () => {
    it('when the next upcoming appointment is a community cares appointment - C15787', () => {
      mockVAAppointmentsPast30Days();
      mockCCAppointmentsPast30Days();
      // make sure that the Health care section is shown
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByTestId('no-appointment-message').should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
  context('when there is no appointment', () => {
    it('when the next upcoming appointment is a community cares appointment - C15788', () => {
      mockVAAppointmentsEmpty();
      mockCCAppointmentsEmpty();
      // make sure that the Health care section is shown
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByTestId('no-appointment-message').should('exist');

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
});
