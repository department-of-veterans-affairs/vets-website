import {
  initAppointmentListMock,
  initVAAppointmentMock,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('Appointment Request', () => {
  beforeEach(() => {
    initAppointmentListMock();
    initVAAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.get('.va-modal-body button').click();
  });

  it('should submit an a va appointment', () => {
    // Start flow
    cy.injectAxe();
    cy.findByText('Schedule an appointment').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    cy.url().should('include', '/choose-facility-type');
    cy.injectAxe();
    cy.findByLabelText(/VA medical center/).click();
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
    const additionalInfo = 'cough';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoTest();

    // Review
    newApptTests.reviewTest();

    // Confirmation page
    newApptTests.confirmationPageTest(additionalInfo);
  });
});
