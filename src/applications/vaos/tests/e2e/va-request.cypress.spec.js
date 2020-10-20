import {
  initAppointmentListMock,
  initVARequestMock,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('Appointment requests', () => {
  beforeEach(() => {});

  it('should submit form successfully', () => {
    initAppointmentListMock();
    initVARequestMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();

    // Start flow
    cy.findByText('Schedule an appointment').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    cy.url().should('include', '/choose-facility-type');
    cy.axeCheck();
    cy.findByLabelText(/VA medical center/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityTest();

    // Choose date and slot (AM or PM)
    newApptTests.selectRequestSlotTest();

    // Reason for appointment
    newApptTests.reasonForAppointmentTest(
      'cough',
      /Please give us more detail about why/,
    );

    // Visit type
    newApptTests.howToBeSeenTest();

    // Contact info
    newApptTests.contactInfoTest();

    // Review
    cy.url().should('include', '/review');
    cy.axeCheck();
    cy.findByText('Request appointment').click();

    // Confirmation page
    cy.findByText('Your appointment request has been submitted');
    cy.findByText('VA appointment');
    cy.findByText('Show more').click();
    cy.findByText('Follow-up/Routine');
    cy.findByText('cough');
  });
});
