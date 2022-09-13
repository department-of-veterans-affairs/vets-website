import {
  vaosSetup,
  mockFeatureToggles,
  mockAppointmentRequestMessagesApi,
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockPreferencesApi,
  mockSupportedSitesApi,
  mockRequestEligibilityCriteriaApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockRequestLimitsApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockVisitsApi,
  mockLoginApi,
  mockCCEligibilityApi,
  mockEligibilityApi,
  mockFacilityApi,
  mockSchedulingConfigurationApi,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

// skipped due to failures with date validation
describe('VAOS VA request flow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestMessagesApi();
    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockCCProvidersApi();
    mockFacilitiesApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockPreferencesApi();
    mockSupportedSitesApi();
    mockRequestEligibilityCriteriaApi();
    mockDirectBookingEligibilityCriteriaApi();
    mockRequestLimitsApi();
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectScheduleSlotsApi({ apiVersion: 0 });
    mockPreferencesApi();
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
    if (facilitySelection) facilitySelection();
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

    // Check messages requestBody is as expected
    cy.wait('@v0:create:messages').should(xhr => {
      const { body } = xhr.request;
      expect(body).to.have.property('messageText', 'cough');
    });

    // Confirmation page
    cy.url().should('include', '/requests/testing');
    // cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
    cy.axeCheckBestPractice();
  }

  it('should submit form successfully for a multi system user', () => {
    mockLoginApi({ withoutAddress: false });

    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });
    cy.axeCheckBestPractice();
  });

  it('should submit form successfully for a single system user', () => {
    mockLoginApi({ withoutAddress: false });
    mockFacilitiesApi({ count: 1, apiVersion: 0 });
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });

    cy.axeCheckBestPractice();
  });

  it('should display Cerner how to schedule page if a Cerner facility is chosen', () => {
    mockLoginApi({ cernerFacilityId: '983' });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility-2');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Rawlins/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    cy.url().should('include', '/how-to-schedule');
    cy.findByText(/Rawlins VA Clinic/);
    cy.findByText(/To schedule an appointment online at this facility/);
    cy.axeCheckBestPractice();
  });
});

describe('VAOS VA request flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983GB'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({ clinicId: '455', apiVersion: 2 });
    mockEligibilityApi({ isEligible: true });
    mockFacilityApi({ id: '983GB', apiVersion: 2 });
    mockFacilitiesApi({ apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockLoginApi();
    mockPreferencesApi();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
  });

  it('should submit request successfully', () => {
    mockLoginApi();
    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    // VATS Settings
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '983GB'],
      typeOfCareId: 'socialWork',
      isRequest: true,
    });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Sidney/)
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

      expect(body.locationId).to.eq('983GB');
      expect(body).to.have.property('serviceType', 'socialWork');
      expect(body).to.have.property('kind', 'clinic');
      expect(body.contact.telecom[1].value).to.equal('veteran@gmail.com');
      expect(body.contact.telecom[0].value).to.equal('5035551234');
    });
    cy.url().should('include', '/requests/mock1');
    cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
  });
});
