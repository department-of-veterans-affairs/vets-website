import moment from 'moment';
import {
  initAppointmentListMock,
  initVAAppointmentMock,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe.skip('VAOS direct schedule flow', () => {
  it('should submit form', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select primary care appointment type
    cy.get('#schedule-new-appointment-0').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityV2Test();

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
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
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
        'Follow-up/Routine: cough',
      );
      expect(request).to.have.property('preferredEmail', 'veteran@gmail.com');
    });
    cy.wait('@appointmentPreferences').should(xhr => {
      const request = xhr.requestBody;
      expect(request.emailAddress).to.eq('veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageTest(additionalInfo);
  });

  it('should submit form with an eye care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select primary care appointment type
    cy.get('#schedule-new-appointment-0').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Eye care');

    // Type of eye care
    cy.url().should('include', '/choose-eye-care');
    cy.axeCheck();
    cy.findByLabelText(/Optometry/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test();

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
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
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
    newApptTests.confirmationPageTest(additionalInfo);
  });

  it('should submit form with a sleep care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select primary care appointment type
    cy.get('#schedule-new-appointment-0').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Sleep medicine');

    // Type of sleep care
    cy.url().should('include', '/choose-sleep-care');
    cy.axeCheck();
    cy.findByLabelText(/Sleep medicine/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test();

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
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
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
    newApptTests.confirmationPageTest(additionalInfo);
  });
});
describe.skip('VAOS direct schedule flow with a Cerner site', () => {
  it('should submit form', () => {
    initAppointmentListMock();
    initVAAppointmentMock({ cernerUser: true });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select primary care appointment type
    cy.get('#schedule-new-appointment-0').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Facility
    newApptTests.chooseVAFacilityTest();

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
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
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
        'Follow-up/Routine: cough',
      );
      expect(request).to.have.property('preferredEmail', 'veteran@gmail.com');
    });
    cy.wait('@appointmentPreferences').should(xhr => {
      const request = xhr.requestBody;
      expect(request.emailAddress).to.eq('veteran@gmail.com');
    });

    // Confirmation page
    newApptTests.confirmationPageTest(additionalInfo);
  });

  it('should submit form with an eye care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock({ cernerUser: true });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select primary care appointment type
    cy.get('#schedule-new-appointment-0').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Eye care');

    // Type of eye care
    cy.url().should('include', '/choose-eye-care');
    cy.axeCheck();
    cy.findByLabelText(/Optometry/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityTest();

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
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
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
    newApptTests.confirmationPageTest(additionalInfo);
  });

  it('should submit form with a sleep care type of care', () => {
    initAppointmentListMock();
    initVAAppointmentMock({ cernerUser: true });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select primary care appointment type
    cy.get('#schedule-new-appointment-0').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Sleep medicine');

    // Type of sleep care
    cy.url().should('include', '/choose-sleep-care');
    cy.axeCheck();
    cy.findByLabelText(/Sleep medicine/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityTest();

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
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
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
    newApptTests.confirmationPageTest(additionalInfo);
  });
});
