import moment from 'moment/moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import {
  vaosSetup,
  mockFeatureToggles,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockLoginApi,
  mockCCEligibilityApi,
  mockSchedulingConfigurationApi,
  mockUserTransitionAvailabilities,
  mockEligibilityApi,
  mockFacilityApi,
  mockAppointmentApi,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';
import { mockVamcEhr } from './vaos-cypress-v2-helpers';

describe('VAOS VA request flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();

    // mockAppointmentsApi({ apiVersion: 0 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983HK'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({ clinicId: '455', apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockUserTransitionAvailabilities();
  });

  it('should display Cerner how to schedule page if a Cerner facility is chosen', () => {
    const appointments = [
      {
        id: '1',
        type: 'appointment',
        attributes: {
          clinic: '308',
          end: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          id: '1',
          locationId: '983GB',
          serviceType: 'socialWork',
          start: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          status: 'booked',
        },
      },
    ];

    mockAppointmentsApi({ data: appointments, apiVersion: 2 });
    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    mockLoginApi({ facilityId: '983' });
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '984'],
      typeOfCareId: 'socialWork',
      isDirect: true,
      isRequest: true,
    });
    mockVamcEhr({ isCerner: true });
    const data = [
      {
        id: '983',
        type: 'facilities',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      {
        id: '984',
        type: 'facilities',
        attributes: {
          id: '984',
          vistaSite: '984',
          name: 'Dayton VA Medical Center',
          physicalAddress: {
            line: ['4100 West Third Street'],
            city: 'Dayton',
            state: 'OH',
            postalCode: '45428-9000',
          },
        },
      },
    ];

    mockFacilitiesApi({ data, apiVersion: 2 });
    mockClinicApi({ locations: ['983'], apiVersion: 2 });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
    cy.wait('@drupal-source-of-truth');

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility-2', { timeout: Timeouts.slow });
    cy.axeCheckBestPractice();
    cy.wait(['@v2:get:facilities', '@scheduling-configurations']);
    cy.findByLabelText(/Cheyenne VA Medical Center/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    cy.url().should('include', '/how-to-schedule');
    cy.findByText(/Cheyenne VA Medical Center/i);
    cy.findByText(/To schedule an appointment online at this facility/);
    cy.axeCheckBestPractice();
  });

  it('should submit form successfully for a multi system user', () => {
    const data = [
      {
        id: '983',
        type: 'facilities',
        attributes: {
          id: '983',
          vistaSite: '983',
          vastParent: '983',
          name: 'Cheyenne VA Medical Center',
          classification: 'VA Medical Center (VAMC)',
          physicalAddress: {
            line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      {
        id: '983GB',
        type: 'facilities',
        attributes: {
          id: '983GB',
          vistaSite: '983',
          name: 'Sidney VA Clinic',
          physicalAddress: {
            line: ['1116 10th Avenue'],
            city: 'Sidney',
            state: 'NE',
            postalCode: '69162-2001',
          },
        },
      },
    ];

    mockAppointmentsApi({ apiVersion: 2 });
    mockClinicApi({ locations: ['983', '983GB'], apiVersion: 2 });
    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    mockFacilitiesApi({ data, apiVersion: 2 });
    mockFacilityApi({ id: '983GB', apiVersion: 2 });
    mockLoginApi({ withoutAddress: false });
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '983GB'],
      typeOfCareId: 'socialWork',
      isDirect: false,
      isRequest: true,
    });
    mockVamcEhr();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility');
    cy.axeCheckBestPractice();

    cy.findByLabelText(/Sidney/)
      .focus()
      .click();

    cy.wait(['@v2:get:facilities']);
    cy.findByText(/Continue/).click();

    // Choose date and slot (AM or PM)
    newApptTests.selectRequestSlotTest();

    // Reason for appointment
    newApptTests.reasonForAppointmentTest(
      'cough',
      /Please provide any additional details/,
    );

    // Visit type
    newApptTests.howToBeSeenTest();

    // Contact info
    newApptTests.contactInfoTest();

    // Review
    cy.url().should('include', '/review');
    cy.axeCheckBestPractice();
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@v2:create:appointment').should(xhr => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain('/vaos/v2/appointments');

      const { body } = xhr.request;
      expect(body.contact).to.have.property('telecom');
      expect(body.kind).to.eq('clinic');
      expect(body.locationId).to.eq('983GB');
      expect(body.preferredTimesForPhoneCall).to.include('Morning');
      expect(body.reasonCode).to.have.property('text', 'cough');

      // TODO: Verify timezone
      expect(body.requestedPeriods).to.have.lengthOf(1);
      expect(body).to.have.property('serviceType', 'socialWork');
    });
  });

  it('should submit form successfully for a single system user', () => {
    const data = [
      {
        id: '983GB',
        type: 'facilities',
        attributes: {
          id: '983GB',
          vistaSite: '983',
          name: 'Sidney VA Clinic',
          physicalAddress: {
            line: ['1116 10th Avenue'],
            city: 'Sidney',
            state: 'NE',
            postalCode: '69162-2001',
          },
        },
      },
    ];

    mockAppointmentApi({
      data: {
        id: 'mock1',
        type: 'Appointment',
        attributes: {
          contact: {
            telecom: [
              { type: 'phone', value: '5035551234' },
              { type: 'email', value: 'veteran@gmail.com' },
            ],
          },
          id: 'mock1',
          kind: 'clinic',
          locationId: '983GB',
          preferredTimesForPhoneCall: ['Morning'],
          reasonCode: { text: 'cough' },
          requestedPeriods: [
            {
              start: moment().format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD'),
            },
          ],
          serviceType: 'socialWork',
          status: 'proposed',
        },
      },
      id: 'mock1',
    });
    mockAppointmentsApi({ apiVersion: 2 });
    mockClinicApi({ locations: ['983', '983GB'], apiVersion: 2 });
    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    mockFacilitiesApi({ data, apiVersion: 2 });
    mockFacilityApi({ id: '983GB', apiVersion: 2 });
    mockLoginApi({ withoutAddress: false });
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '983GB'],
      typeOfCareId: 'socialWork',
      isDirect: false,
      isRequest: true,
    });
    mockVamcEhr();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility');
    cy.axeCheckBestPractice();

    cy.findByText(/Continue/).click();

    // Choose date and slot (AM or PM)
    newApptTests.selectRequestSlotTest();

    // Reason for appointment
    newApptTests.reasonForAppointmentTest(
      'cough',
      /Please provide any additional details/,
    );

    // Visit type
    newApptTests.howToBeSeenTest();

    // Contact info
    newApptTests.contactInfoTest();

    // Review
    cy.url().should('include', '/review');
    cy.axeCheckBestPractice();
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@v2:create:appointment').should(xhr => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain('/vaos/v2/appointments');

      const { body } = xhr.request;
      expect(body.contact).to.have.property('telecom');
      expect(body.kind).to.eq('clinic');
      expect(body.locationId).to.eq('983GB');
      expect(body.preferredTimesForPhoneCall).to.include('Morning');
      expect(body.reasonCode).to.have.property('text', 'cough');

      // TODO: Verify timezone
      expect(body.requestedPeriods).to.have.lengthOf(1);
      expect(body).to.have.property('serviceType', 'socialWork');
    });

    cy.axeCheckBestPractice();
  });
});
