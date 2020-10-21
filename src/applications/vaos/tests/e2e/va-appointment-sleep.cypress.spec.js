import moment from 'moment';
import {
  initAppointmentListMock,
  initVAAppointmentMock,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('Appointment Request', () => {
  it('should submit an a va appointment', () => {
    initAppointmentListMock();
    initVAAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();

    // Start flow
    cy.findByText('Schedule an appointment').click();

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
