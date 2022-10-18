import moment from '../../utils/business-days';
import {
  mockCCEligibilityApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockEligibilityApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockSchedulingConfigurationApi,
  mockAppointmentsApi,
  vaosSetup,
  mockAppointmentRequestMessagesApi,
  mockAppointmentRequestsApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockSupportedSitesApi,
  mockRequestEligibilityCriteriaApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockRequestLimitsApi,
  mockVisitsApi,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('VAOS direct schedule flow', () => {
  const start = moment()
    .addBusinessDay(5, 'days')
    // Adding number months to account for the test clicking the 'next' button to
    // advance to the next month.
    .add(1, 'months')
    .startOf('month')
    .day(9);
  const end = moment(start).add(60, 'minutes');

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
    mockDirectScheduleSlotsApi({ start, end, apiVersion: 0 });
    mockPreferencesApi();
    mockVisitsApi();
  });

  it('should submit form', () => {
    mockLoginApi({ withoutAddress: false });
    mockCCEligibilityApi();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.axeCheckBestPractice();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'cough';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    const fullReason = 'Follow-up/Routine: cough';
    cy.wait('@v0:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.clinic.siteCode).to.eq('983');
      expect(body.clinic.clinicId).to.eq('455');
      expect(body).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body).to.have.property('dateTime');
      expect(body).to.have.property('bookingNotes', fullReason);
      expect(body).to.have.property('preferredEmail', 'veteran@gmail.com');
    });
    // TODO: Not needed since check is in the mock
    cy.wait('@v0:update:preferences').should(xhr => {
      const { body } = xhr.request;
      expect(body.emailAddress).to.eq('veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(fullReason);
  });

  it('should submit form with an eye care type of care', () => {
    mockLoginApi({ withoutAddress: false });
    mockCCEligibilityApi({ typeOfCare: 'Optometry' });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.axeCheckBestPractice();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Eye care');

    // Type of eye care
    cy.url().should('include', '/choose-eye-care');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Optometry/).click();
    cy.findByText(/Continue/).click();

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'insomnia';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    const fullReason = 'Follow-up/Routine: insomnia';
    cy.wait('@v0:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.clinic.siteCode).to.eq('983');
      expect(body.clinic.clinicId).to.eq('455');
      expect(body).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body).to.have.property('dateTime');
      expect(body).to.have.property(
        'bookingNotes',
        'Follow-up/Routine: insomnia',
      );
      expect(body).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(fullReason);
  });

  it('should submit form with a sleep care type of care', () => {
    mockLoginApi({ withoutAddress: false });
    mockCCEligibilityApi();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Sleep medicine');

    // Type of sleep care
    cy.url().should('include', '/choose-sleep-care');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Sleep medicine/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'insomnia';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    const fullReason = 'Follow-up/Routine: insomnia';
    cy.wait('@v0:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.clinic.siteCode).to.eq('983');
      expect(body.clinic.clinicId).to.eq('455');
      expect(body).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body).to.have.property('dateTime');
      expect(body).to.have.property(
        'bookingNotes',
        'Follow-up/Routine: insomnia',
      );
      expect(body).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(fullReason);
  });
});

describe('VAOS direct schedule flow using VAOS service', () => {
  const start = moment()
    .addBusinessDay(5, 'days')
    // Adding number months to account for the test clicking the 'next' button to
    // advance to the next month.
    .add(1, 'months')
    .startOf('month')
    .day(9);
  const end = moment(start).add(60, 'minutes');

  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({
      clinicId: '455',
      start,
      end,
      apiVersion: 2,
    });
    mockEligibilityApi({ isEligible: true });
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFacilitiesApi({ apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockLoginApi();
    mockPreferencesApi();
    mockSchedulingConfigurationApi();
  });

  it('should submit form', () => {
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.wait('@mockUser');
    cy.injectAxe();
    cy.axeCheckBestPractice();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
      apiVersion: 2,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'cough';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    // const fullReason = 'Follow-up/Routine: cough';
    cy.wait('@v2:create:appointment').should(xhr => {
      const request = xhr.request.body;

      expect(request.locationId).to.eq('983');
      expect(request.clinic).to.eq('455');
      expect(request.extension).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(request.status).to.eq('booked');
    });
    cy.wait('@v0:update:preferences').should(xhr => {
      const request = xhr.request.body;
      expect(request.emailAddress).to.eq('veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(null, false);
  });
});
