import Timeouts from 'platform/testing/e2e/timeouts';

import moment from 'moment';
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
  mockClinicApi,
} from './vaos-cypress-helpers';
import { mockVamcEhr } from './vaos-cypress-v2-helpers';

describe('VAOS appointment list', () => {
  describe('appointments details', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestsApi();
      mockFacilitiesApi({ apiVersion: 1 });
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

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
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

    it('va appointment', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            kind: 'clinic',
            status: 'booked',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilityApi({ id: 'vha_442GC', apiVersion: 1 });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=upcoming-appointment-list-header]').should('be.visible');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Appointment/i)
        .first()
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-appointment-details-header]')
        .should('exist')
        .contains('VA appointment');

      cy.axeCheckBestPractice();
    });

    it('va phone appointment', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            clinic: '308',
            id: 1,
            kind: 'phone',
            // Uncomment to remove 'v1/facilities/va/vha_442' api call to get
            // location information.
            // location: {
            //   id: '983',
            //   type: 'location',
            //   attributes: {
            //     id: '983',
            //     name: 'Cheyenne VA Medical Center',
            //     physicalAddress: {
            //       city: 'Cheyenne',
            //       line: [''],
            //       postalCode: '82001-5356',
            //       state: 'WY',
            //     },
            //   },
            // },
            locationId: '983',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            status: 'booked',
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockClinicApi({ clinicId: '308', locations: ['983'] });

      // NOTE: Mock not needed if location information is included with the
      // appointment
      mockFacilityApi({
        id: data[0].attributes.locationId,
        apiVersion: 1,
      });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/Phone call/i)
        .first()
        .click();

      cy.wait(['@v2:get:clinic']);

      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-appointment-details-header]')
        .should('exist')
        .contains('VA appointment over the phone');
      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Cheyenne VA Medical Center');

      cy.axeCheckBestPractice();
    });

    it('va video appointment', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            clinic: '308',
            id: 1,
            kind: 'telehealth',
            location: {
              id: '983',
              type: 'location',
              attributes: {
                name: 'Cheyenne VA Medical Center',
                physicalAddress: {
                  city: 'Cheyenne',
                  line: [''],
                  postalCode: '82001-5356',
                  state: 'WY',
                },
              },
            },
            locationId: '983',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            status: 'booked',
            telehealth: {
              url:
                'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VAC00064b6f@care2.evn.va.gov&pin=4569928835#',
              atlas: null,
              vvsKind: 'CLINIC_BASED',
            },
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Video Connect at a VA Location/i)
        .first()
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-video-appointment-details-header]')
        .should('exist')
        .contains('VA Video Connect at VA location');

      cy.axeCheckBestPractice();
    });

    it('va video appointment at an ATLAS location', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            clinic: '308',
            id: 1,
            kind: 'telehealth',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            status: 'booked',
            telehealth: {
              url: null,
              atlas: {
                siteCode: '9931',
                confirmationCode: '7VBBCA',
                address: {
                  streetAddress: '114 Dewey Ave',
                  city: 'Eureka',
                  state: 'MT',
                  zipCode: '59917',
                  country: 'USA',
                  longitude: -115.1,
                  latitude: 48.8,
                  additionalDetails: '',
                },
              },
              vvsKind: 'ADHOC',
            },
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Video Connect at an ATLAS Location/i)
        .first()
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-video-appointment-details-header]')
        .should('exist')
        .contains('VA Video Connect at an ATLAS location');

      cy.axeCheckBestPractice();
    });

    it('va video appointment at home', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            clinic: '308',
            id: 1,
            kind: 'telehealth',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            status: 'booked',
            telehealth: {
              url:
                'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VAC00064b6f@care2.evn.va.gov&pin=4569928835#',
              atlas: null,
              vvsKind: 'MOBILE_ANY',
            },
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Video Connect at home/i)
        .first()
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-video-appointment-details-header]')
        .should('exist')
        .contains('VA Video Connect at home');

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
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilityApi({ id: 'vha_442GC', apiVersion: 1 });
      mockCancelReasonsApi({ facilityId: '983' });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
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

  describe('upcoming appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 2 });
      mockFacilitiesApi({ apiVersion: 1 });
      mockFeatureToggles({ v2Requests: true, v2DirectSchedule: true });
      mockLoginApi();
      mockUserTransitionAvailabilities();

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);
    });

    it('should render upcoming appointments list', () => {
      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=upcoming-appointment-list]').should('exist');
      cy.get('[data-testid="vaosSelect"]').should('be.visible');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');
      cy.axeCheckBestPractice();
    });

    it('should navigate to upcoming appointment details', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .click();
      cy.findByText(/Appointment detail/i).should('exist');
      cy.axeCheckBestPractice();
    });
  });

  describe('requested appointments', () => {
    beforeEach(() => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            kind: 'clinic',
            status: 'booked',
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
      ];

      vaosSetup();

      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilitiesApi({ apiVersion: 1 });
      mockAppointmentRequestsApi({ id: '8a4886886e4c8e22016e6613216d001g' });
      mockFeatureToggles({ v2DirectSchedule: true });
      mockLoginApi();
      mockUserTransitionAvailabilities();

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=upcoming-appointment-list]').should('exist');
      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('requested')
        .should('have.value', 'requested');
      cy.get('h2').contains(/Requested/i);
    });

    it('should render requested appointments list', () => {
      cy.get('[data-cy=requested-appointment-list]').should('exist');
      cy.get('[data-cy=requested-appointment-list-item]')
        .first()
        .should('exist');

      cy.axeCheckBestPractice();
    });

    it('should navigate to requested appointment details', () => {
      cy.get('[data-testid="appointment-detail-link"]')
        .first()
        .shadow()
        .find('a')
        .click();

      cy.findByText(/Request detail/i).should('exist');
      cy.injectAxe();
      cy.axeCheckBestPractice();
    });
  });

  describe('past appointments', () => {
    beforeEach(() => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            status: 'booked',
            start: moment()
              .subtract(1, 'month')
              .format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
      ];
      vaosSetup();

      mockAppointmentRequestsApi();
      mockAppointmentsApi({ data, apiVersion: 2 });
      mockFacilitiesApi({ apiVersion: 1 });
      mockFeatureToggles({ v2DirectSchedule: true });
      mockLoginApi();
      mockUserTransitionAvailabilities();

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('past')
        .should('have.value', 'past');
      cy.get('h2').contains(/Past appointments/i);
    });

    it('should render past appointments list', () => {
      cy.wait('@v2:get:appointments');
      cy.get('#date-dropdown')
        .shadow()
        .findByLabelText(/Select a date range/i)
        .should('exist');
      cy.get('[data-cy=past-appointment-list]').should('exist');
      cy.get('[data-cy=past-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');

      cy.axeCheckBestPractice();
    });

    it('should navigate to past appointment details', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .click({ waitForAnimations: true });
      cy.findByText(/Appointment detail/i).should('exist');

      cy.axeCheckBestPractice();
    });

    it('should select an updated date range', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');
      cy.get('#date-dropdown')
        .shadow()
        .find('#select')
        .select('1')
        .should('have.value', '1');
      cy.get('button')
        .contains(/Update/i)
        .click({ force: true });
      cy.get('[data-cy=appointment-list-item]').should('not.exist');

      cy.axeCheckBestPractice();
    });
  });

  describe('canceled appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestsApi();
      mockFacilitiesApi({ apiVersion: 1 });
      mockFeatureToggles({ v2DirectSchedule: true });
      mockLoginApi();
      mockUserTransitionAvailabilities();
    });

    it('should render canceled appointments list', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            status: 'cancelled',
            start: moment()
              .subtract(1, 'month')
              .format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('canceled')
        .should('have.value', 'canceled');
      cy.get('h2').contains(/Canceled appointments/i);

      cy.get('[data-cy=canceled-appointment-list-header]').should('exist');
      cy.get('[data-cy=canceled-appointment-list]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');

      cy.axeCheckBestPractice();
    });

    it('should navigate to canceled appointment details', () => {
      const data = [
        {
          id: '1',
          type: 'Appointment',
          attributes: {
            id: 1,
            status: 'cancelled',
            start: moment()
              .subtract(1, 'month')
              .format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
      ];

      mockAppointmentsApi({ data, apiVersion: 2 });

      cy.visit('health-care/schedule-view-va-appointments/appointments/');
      cy.injectAxe();

      cy.wait(['@v2:get:appointments']);

      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('canceled')
        .should('have.value', 'canceled');
      cy.get('h2').contains(/Canceled appointments/i);

      cy.get('[data-cy=appointment-list-item]')
        .first()
        .click({ waitForAnimations: true });
      cy.findByText(/Appointment detail/i).should('exist');

      cy.axeCheckBestPractice();
    });
  });
});
