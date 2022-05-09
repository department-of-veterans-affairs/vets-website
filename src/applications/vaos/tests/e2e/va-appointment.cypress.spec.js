import moment from 'moment';
import {
  initAppointmentListMock,
  initVAAppointmentMock,
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
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('VAOS direct schedule flow', () => {
  it('should submit form', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    mockFeatureToggles();
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
    newApptTests.chooseVAFacilityV2Test(/Cheyenne VA Medical Center/);

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
    newApptTests.confirmationPageV2Test(fullReason);
  });

  it('should submit form with an eye care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
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

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test(/Cheyenne VA Medical Center/);

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
    newApptTests.confirmationPageV2Test(fullReason);
  });

  it('should submit form with a sleep care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
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
    newApptTests.chooseVAFacilityV2Test(/Cheyenne VA Medical Center/);

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
    newApptTests.confirmationPageV2Test(fullReason);
  });
});

describe('VAOS direct schedule flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({ clinicId: '455', apiVersion: 2 });
    mockEligibilityApi({ isEligible: true });
    mockFacilityApi({ id: '983', apiVersion: 2 });
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
    newApptTests.chooseVAFacilityV2Test(/Cheyenne VA Medical Center/);

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
        `${moment()
          .add(1, 'month')
          .startOf('month')
          .add(4, 'days')
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
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
