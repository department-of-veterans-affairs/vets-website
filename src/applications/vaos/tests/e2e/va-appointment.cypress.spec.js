import moment from 'moment';
import {
  initAppointmentListMock,
  initVAAppointmentMock,
  vaosSetup,
} from './vaos-cypress-helpers';
import {
  mockAppointmentsApi,
  mockCCPrimaryCareEligibility,
  mockClinicApi,
  mockDirectScheduleSlots,
  mockEligibilityApi,
  mockFacilityApi,
  mockFeatureToggleApi,
  mockGetSchedulingConfiguration,
  mockLoginApi,
  mockPreferencesApi,
} from './vaos-cypress-routes';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('VAOS direct schedule flow', () => {
  it('should submit form', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    mockFeatureToggleApi({
      vaOnlineSchedulingFacilitiesServiceV2: false,
      vaOnlineSchedulingStatusImprovement: false,
      vaOnlineSchedulingVAOSServiceCCAppointments: false,
      vaOnlineSchedulingVAOSServiceRequests: false,
      vaOnlineSchedulingVAOSServiceVAAppointments: false,
    });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxeThenAxeCheck();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityTest(/Cheyenne VA Medical Center/);

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
    cy.wait('@appointmentSubmission').should(xhr => {
      const request = xhr.requestBody;

      expect(request.clinic.siteCode).to.eq('983');
      expect(request.clinic.clinicId).to.eq('455');
      expect(request).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'month')
          .startOf('month')
          .add(4, 'days')
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(request).to.have.property('dateTime');
      expect(request).to.have.property('bookingNotes', fullReason);
      expect(request).to.have.property('preferredEmail', 'veteran@gmail.com');
    });
    cy.wait('@appointmentPreferences').should(xhr => {
      const request = xhr.requestBody;
      expect(request.emailAddress).to.eq('veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test({ fullReason });
  });

  it('should submit form with an eye care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    mockFeatureToggleApi({
      vaOnlineSchedulingFacilitiesServiceV2: false,
      vaOnlineSchedulingStatusImprovement: false,
      vaOnlineSchedulingVAOSServiceCCAppointments: false,
      vaOnlineSchedulingVAOSServiceRequests: false,
      vaOnlineSchedulingVAOSServiceVAAppointments: false,
    });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Eye care');

    // Type of eye care
    cy.url().should('include', '/choose-eye-care');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Optometry/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityTest(/Cheyenne VA Medical Center/);

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
    cy.wait('@appointmentSubmission').should(xhr => {
      const request = xhr.requestBody;

      expect(request.clinic.siteCode).to.eq('983');
      expect(request.clinic.clinicId).to.eq('455');
      expect(request).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'month')
          .startOf('month')
          .add(4, 'days')
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(request).to.have.property('dateTime');
      expect(request).to.have.property(
        'bookingNotes',
        'Follow-up/Routine: insomnia',
      );
      expect(request).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test({ fullReason });
  });

  it('should submit form with a sleep care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    mockFeatureToggleApi({
      vaOnlineSchedulingFacilitiesServiceV2: false,
      vaOnlineSchedulingStatusImprovement: false,
      vaOnlineSchedulingVAOSServiceCCAppointments: false,
      vaOnlineSchedulingVAOSServiceRequests: false,
      vaOnlineSchedulingVAOSServiceVAAppointments: false,
    });

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
    newApptTests.chooseVAFacilityTest(/Cheyenne VA Medical Center/);

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
    cy.wait('@appointmentSubmission').should(xhr => {
      const request = xhr.requestBody;

      expect(request.clinic.siteCode).to.eq('983');
      expect(request.clinic.clinicId).to.eq('455');
      expect(request).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'month')
          .startOf('month')
          .add(4, 'days')
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(request).to.have.property('dateTime');
      expect(request).to.have.property(
        'bookingNotes',
        'Follow-up/Routine: insomnia',
      );
      expect(request).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test({ fullReason });
  });
});

describe('VAOS direct schedule flow v2', () => {
  it('should submit form', () => {
    vaosSetup();

    mockAppointmentsApi({ id: '983', apiVersion: 0 });
    mockAppointmentsApi({ id: '983', apiVersion: 2 });
    mockCCPrimaryCareEligibility();
    mockClinicApi({ clinicId: '308', locations: ['983'], apiVersion: 2 });
    mockEligibilityApi();
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFeatureToggleApi();
    mockGetSchedulingConfiguration();
    mockLoginApi();
    mockPreferencesApi();

    const start = moment()
      // Set moment to 'utc' mode so formatting will contain 'Z' like api call
      .utc()
      .add(1, 'month')
      .startOf('month')
      .add(4, 'days');
    const end = moment(start).utc();

    mockDirectScheduleSlots({
      clinicId: '308', // get clinic id from mock file
      start: start.format(),
      end: end.format(),
      apiVersion: 2,
    });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.wait('@mockUser');
    cy.injectAxeThenAxeCheck();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityTest(/Cheyenne VA Medical Center/);
    // newApptTests.chooseVAFacilityV2Test();

    // Choose Clinic
    newApptTests.chooseClinicTest({ apiVersion: 2 });

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
    cy.wait(['@v2:create:appointment']).should(xhr => {
      const { body } = xhr.request;
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.url, 'post url').to.contain('/vaos/v2/appointments');
      expect(body.clinic).to.eq('308');
      expect(body.extension).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'month')
          .startOf('month')
          .add(4, 'days')
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body.slot).to.have.property('id', '123');
      expect(body.locationId).to.eq('983');
      expect(body.status).to.eq('booked');
    });
    cy.wait('@v2:get:appointment').should(xhr => {
      const { data } = xhr.response.body;
      expect(data.id).to.eq('mock1');
      expect(data.attributes).to.have.property('cancellable', 'booked');
      expect(data.attributes).to.have.property('clinic', '308');
      expect(data.attributes.extension).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'month')
          .startOf('month')
          .add(4, 'days')
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(data.attributes).to.have.property('kind', 'clinic');
      expect(data.attributes.slot).to.have.property('id', '123');
      expect(data.attributes).to.have.property('status', 'booked');
    });
    cy.wait('@v0:update:preferences').should(xhr => {
      const { body } = xhr.request;
      expect(body.emailAddress).to.eq('veteran@gmail.com');
    });

    // Confirmation page
    // TODO: Not sure why fullReason field is empty!
    newApptTests.confirmationPageV2Test({ apiVersion: 2 });
  });
});
