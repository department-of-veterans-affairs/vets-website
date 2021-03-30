import moment from 'moment';
import {
  initAppointmentListMock,
  initVaccineAppointmentMock,
} from './vaos-cypress-helpers';

describe('VAOS COVID-19 vaccine appointment flow', () => {
  it('should submit form', () => {
    initAppointmentListMock();
    initVaccineAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Select COVID-19 vaccine appointment type
    cy.get('#schedule-new-appointment-1').click();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Plan ahead page
    cy.url().should('include', '/new-covid-19-vaccine-booking');
    cy.axeCheckBestPractice();
    cy.contains('button', 'Continue')
      .focus()
      .click();

    // Screener page
    cy.url().should('include', '/received-dose');
    cy.axeCheckBestPractice();
    cy.get('#root_hasReceivedDoseNo')
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    // Choose VA Flat Facility
    cy.url().should('include', '/facility');
    cy.findByText(/Some COVID-19 vaccines require 2 doses/i).should('exist');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/cheyenne/i).click();
    cy.findByText(/Continue/).click();

    // Choose Clinic
    cy.url().should('include', '/clinic');
    cy.axeCheckBestPractice();
    cy.findByText(/Choose a clinic located at/);
    cy.get('#root_clinicId_0')
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    // Select time slot
    cy.url().should('include', '/select-date-1');
    cy.findByText(/Finding appointment availability.../i).should('not.exist');
    cy.contains('button', 'Next')
      .focus()
      .click();
    cy.get(
      '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])',
    ).click();
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Continue/).click();

    // Second dose page
    cy.url().should('include', '/plan-second-dose');
    cy.axeCheckBestPractice();
    cy.findByText(/Continue/).click();

    // Contact info
    cy.url().should('include', '/contact-info');
    cy.axeCheckBestPractice();
    cy.findByText(/Continue/).click();

    // Review
    cy.url().should('include', '/review');
    cy.axeCheckBestPractice();
    cy.findByText('Confirm appointment').click();

    // Check form requestBody is as expected
    cy.wait('@appointmentSubmission').should(xhr => {
      const request = xhr.requestBody;

      expect(request.clinic.siteCode).to.eq('983');
      expect(request.clinic.clinicId).to.eq('455');
      expect(request).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'day')
          .add(1, 'months')
          .startOf('month')
          .day(9)
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(request).to.have.property('dateTime');
      expect(request).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    // Confirmation page
    cy.findByText('We’ve scheduled your appointment');
    cy.findByText('COVID-19 Vaccine');
    cy.axeCheckBestPractice();
  });
});
