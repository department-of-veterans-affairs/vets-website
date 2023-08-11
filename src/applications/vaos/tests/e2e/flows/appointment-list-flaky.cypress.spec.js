// Temporarily moves some flaky tests into a separate file in order to better
// troubleshoot.
//
// The tests below were found to have failed the most often when run with the
// rest of the appointment-list spec and/or had to be retried the most often.
//
import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  mockFeatureToggles,
  mockAppointmentsApi,
  mockLoginApi,
  mockFacilityApi,
  mockAppointmentRequestsApi,
  vaosSetup,
  mockFacilitiesApi,
  mockCancelReasonsApi,
  mockUserTransitionAvailabilities,
  mockVamcEhr,
} from '../vaos-cypress-helpers';

const rootUrl = environment.isProduction()
  ? 'health-care/schedule-view-va-appointments/appointments/'
  : 'my-health/appointments/';

describe('VAOS appointment list', () => {
  describe('appointments details', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestsApi();
      mockFacilitiesApi({ apiVersion: 2 });
      mockFeatureToggles({ v2DirectSchedule: true });
      mockLoginApi();
      mockUserTransitionAvailabilities();
      mockVamcEhr();
    });

    it('community care appointment', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            kind: 'cc',
            status: 'booked',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });

      cy.visit(rootUrl);
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/Community Care/i)
        .first()
        .click();
      cy.url().should('include', '/appointments/cc');
      cy.get('[data-cy=community-care-appointment-details-header]')
        .should('exist')
        .contains('Community care');

      cy.axeCheckBestPractice();
    });

    it('should allow for canceling of appointments', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            kind: 'clinic',
            status: 'booked',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            cancellable: true,
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilityApi({ id: 'vha_442GC', apiVersion: 1 });
      mockCancelReasonsApi({ facilityId: '983' });

      cy.visit(rootUrl);
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Appointment/i)
        .first()
        .click();
      cy.findByText(/Appointment detail/i).should('exist');
      cy.findByText(/Cancel appointment/i).click();
      cy.findByText(/Yes, cancel this appointment/i).click();
      cy.findByTestId('cancel-appointment-SuccessModal').should('exist');
      cy.contains('button', /Continue/i).click();
      cy.get('#cancelAppt').should('not.exist');
      cy.get('.usa-alert-success').should('not.exist');

      cy.axeCheckBestPractice();
    });
  });
});
