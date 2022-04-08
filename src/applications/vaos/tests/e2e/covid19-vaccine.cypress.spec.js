import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import {
  initAppointmentListMock,
  initVaccineAppointmentMock,
  mockFeatureToggles,
} from './vaos-cypress-helpers';

describe('VAOS COVID-19 vaccine appointment flow', () => {
  it('should submit form', () => {
    initAppointmentListMock();
    initVaccineAppointmentMock();
    mockFeatureToggles();
    cy.visit('health-care/schedule-view-va-appointments/appointments');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling', { waitForAnimations: true }).click({
      waitForAnimations: true,
    });

    // Select COVID-19 vaccine appointment type
    cy.get('input[value="covid"]')
      .focus()
      .check();

    // Start vaccine flow
    cy.findByText(/Continue/).click();

    // Plan ahead page
    cy.url().should('include', '/new-covid-19-vaccine-appointment');
    cy.axeCheckBestPractice();
    cy.contains('button', 'Continue')
      .should('not.be.disabled')
      .focus()
      .click();

    // Screener page
    cy.url().should('include', '/confirm-doses-received');
    cy.axeCheckBestPractice();
    cy.get('#root_hasReceivedDoseNo')
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    // Choose VA Flat Facility
    cy.url().should('include', '/choose-facility');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/cheyenne/i).click();
    cy.findByText(/Continue/).click();

    // Choose Clinic
    cy.url().should('include', '/choose-clinic', { timeout: Timeouts.slow });
    cy.axeCheckBestPractice();
    cy.findByText(/Choose where you’d like to get your vaccine/);
    cy.get('#root_clinicId_0')
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    // Select time slot
    cy.url().should('include', '/select-date');
    cy.findByText(/Finding appointment availability.../i).should('not.exist');
    cy.contains('button', 'Next')
      .should('not.be.disabled')
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
    cy.url().should('include', '/second-dose-info');
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
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findAllByText('COVID-19 vaccine');
    cy.findByText('Clinic:');
    cy.axeCheckBestPractice();
  });

  it('should show facility contact page on second dose selection', () => {
    initAppointmentListMock();
    initVaccineAppointmentMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments');
    cy.injectAxe();
    // Start flow
    cy.findByText('Start scheduling', { waitForAnimations: true }).click({
      waitForAnimations: true,
    });

    // Select COVID-19 vaccine appointment type
    cy.get('input[value="covid"]')
      .focus()
      .check();

    // Start vaccine flow
    cy.findByText(/Continue/).click();

    // Plan ahead page
    cy.url().should('include', '/new-covid-19-vaccine-appointment');
    cy.axeCheckBestPractice();
    cy.contains('button', 'Continue')
      .should('not.be.disabled')
      .focus()
      .click();

    // Screener page
    cy.url().should('include', '/confirm-doses-received');
    cy.axeCheckBestPractice();
    cy.get('#root_hasReceivedDoseYes')
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    // Contact Facility Page
    cy.url().should('include', '/contact-facility');
    cy.findByText(/Continue/i).should('not.exist');
    cy.axeCheckBestPractice();
  });

  it('should show facility contact page when vaccine schedule is not available', () => {
    initAppointmentListMock();
    initVaccineAppointmentMock({ unableToScheduleCovid: true });

    cy.visit('health-care/schedule-view-va-appointments/appointments');
    cy.injectAxe();
    // Start flow
    cy.findByText('Start scheduling', { waitForAnimations: true }).click({
      waitForAnimations: true,
    });

    // Select COVID-19 vaccine appointment type
    cy.get('input[value="covid"]')
      .focus()
      .check();

    // Start vaccine flow
    cy.findByText(/Continue/).click();

    // Contact Facility Page
    cy.url().should('include', '/contact-facility');
    cy.findByText('Your facilities');
    cy.axeCheckBestPractice();
    cy.findByText(/Continue/i).should('not.exist');
  });
});
