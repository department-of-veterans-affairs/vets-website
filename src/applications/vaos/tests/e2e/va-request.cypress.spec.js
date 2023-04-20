import moment from 'moment/moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import {
  vaosSetup,
  mockFeatureToggles,
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockSupportedSitesApi,
  mockRequestEligibilityCriteriaApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockRequestLimitsApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockVisitsApi,
  mockLoginApi,
  mockCCEligibilityApi,
  mockSchedulingConfigurationApi,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';
import { mockVamcEhr } from './vaos-cypress-v2-helpers';

// skipped due to failures with date validation
describe('VAOS VA request flow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockCCProvidersApi();
    mockFacilitiesApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockSupportedSitesApi();
    mockRequestEligibilityCriteriaApi();
    mockDirectBookingEligibilityCriteriaApi();
    mockRequestLimitsApi();
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectScheduleSlotsApi({ apiVersion: 0 });
    mockVisitsApi({ facilityId: '983GB' });
  });

  function fillOutForm(facilitySelection) {
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility');
    cy.axeCheckBestPractice();
    if (facilitySelection) {
      cy.wait(['@v1:get:facilities']);
      facilitySelection();
    }
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
    cy.wait('@v0:create:appointment:request').should(xhr => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=va',
      );
      const { body } = xhr.request;
      cy.assertRequestedPeriod(body.optionDate1);
      expect(body)
        .to.have.property('optionDate2')
        .to.equal('No Date Selected');
      expect(body)
        .to.have.property('optionDate3')
        .to.equal('No Date Selected');

      expect(body.facility.facilityCode).to.eq('983GB');
      expect(body.facility.parentSiteCode).to.eq('983');
      expect(body).to.have.property('typeOfCareId', '125');
      expect(body).to.have.property('visitType', 'Office Visit');
      expect(body).to.have.property('optionTime1', 'AM');
      expect(body).to.have.property('optionTime2', 'No Time Selected');
      expect(body).to.have.property('optionTime3', 'No Time Selected');
      expect(body).to.have.property('email', 'veteran@gmail.com');
      expect(body).to.have.property('phoneNumber', '5035551234');
    });

    // Confirmation page
    cy.url().should('include', '/requests/testing');
    // cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
    cy.axeCheckBestPractice();
    cy.wait(['@v1:get:facilities']);
  }

  it('should submit form successfully for a multi system user', () => {
    mockFeatureToggles();
    mockLoginApi({ withoutAddress: false });
    mockAppointmentsApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockVamcEhr();

    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });
    cy.axeCheckBestPractice();
  });

  it('should submit form successfully for a single system user', () => {
    mockFeatureToggles();
    mockLoginApi({ withoutAddress: false });
    mockAppointmentsApi({ apiVersion: 0 });
    mockFacilitiesApi({ count: 1, apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockVamcEhr();

    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });

    cy.axeCheckBestPractice();
  });
});

describe('VAOS VA request flow using VAOS service', () => {
  const appointments = [
    {
      id: '1',
      type: 'appointment',
      attributes: {
        end: moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        id: '1',
        locationId: '442HK',
        serviceType: 'socialWork',
        start: moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        status: 'booked',
      },
    },
  ];
  const facilities = [
    {
      id: '442',
      type: 'facilities',
      attributes: {
        id: '442',
        vistaSite: '442',
        vastParent: '442',
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
      id: '442HK',
      type: 'facilities',
      attributes: {
        id: '442HK',
        vistaSite: '983',
        name: 'Wheatland VA Mobile Clinic',
        physicalAddress: {
          line: ['2360 East Pershing Boulevard'],
          city: 'Cheyenne',
          state: 'WY',
          postalCode: '82001-5356',
        },
      },
    },
  ];

  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ data: appointments, apiVersion: 2 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983GB'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({ clinicId: '455', apiVersion: 2 });
    mockFacilitiesApi({ data: facilities, apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
  });

  it.skip('submit request successfully', () => {
    mockLoginApi();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility-2');
    cy.axeCheckBestPractice();
    cy.wait(['@v2:get:facilities', '@scheduling-configurations']);
    // cy.waitUntil(() => {
    //   return cy.get('[data-testid="facilitiesSelect"]').should('be.visible');
    // });
    cy.findByLabelText(/Wheatland VA Mobile Clinic/)
      .focus()
      .click();
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
      cy.assertRequestedPeriod(body.requestedPeriods[0].start);

      expect(body.locationId).to.eq('442HK');
      expect(body).to.have.property('serviceType', 'socialWork');
      expect(body).to.have.property('kind', 'clinic');
      expect(body.contact.telecom[1].value).to.equal('veteran@gmail.com');
      expect(body.contact.telecom[0].value).to.equal('5035551234');
    });
    cy.url().should('include', '/requests/mock1');
    cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
  });

  it('should display Cerner how to schedule page if a Cerner facility is chosen', () => {
    mockLoginApi({ facilityId: '442' });
    mockSchedulingConfigurationApi({
      facilityIds: ['442HK'],
      typeOfCareId: 'socialWork',
      isDirect: true,
    });
    mockVamcEhr({ isCerner: true });

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
    cy.findByLabelText(/Wheatland VA Mobile Clinic/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    cy.url().should('include', '/how-to-schedule');
    cy.findByText(/Wheatland VA Mobile Clinic/i);
    cy.findByText(/To schedule an appointment online at this facility/);
    cy.axeCheckBestPractice();
  });
});
