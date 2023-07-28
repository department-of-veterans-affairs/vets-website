import moment from 'moment-timezone';
import Timeouts from 'platform/testing/e2e/timeouts';

import {
  mockAppointmentsApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockSchedulingConfigurationApi,
  mockUserTransitionAvailabilities,
  vaosSetup,
} from '../vaos-cypress-helpers';

describe('VAOS COVID-19 vaccine appointment flow using VAOS service', () => {
  const start = moment()
    // Adding number months to account for the test clicking the 'next' button to
    // advance to the next month.
    .add(1, 'days')
    .add(1, 'months')
    .startOf('month')
    .day(9);
  const end = moment(start).add(60, 'minutes');

  it('should submit form', () => {
    vaosSetup();

    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockLoginApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockSchedulingConfigurationApi();
    mockFacilitiesApi({ apiVersion: 2 });
    mockClinicApi({ locations: ['983'], apiVersion: 2 });

    mockDirectScheduleSlotsApi({ clinicId: '455', start, end, apiVersion: 2 });

    cy.visit('my-health/appointments');
    cy.injectAxe();
    cy.axeCheckBestPractice();

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
    cy.wait('@v2:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.locationId).to.eq('983');
      expect(body.clinic).to.eq('455');
      expect(body.extension).to.have.property(
        'desiredDate',
        `${start.utc().format()}`,
      );
    });

    // Confirmation page
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findAllByText('COVID-19 vaccine');
    cy.findByText('Clinic:');
    cy.axeCheckBestPractice();
  });

  it('should show facility contact page on second dose selection', () => {
    vaosSetup();

    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockLoginApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockSchedulingConfigurationApi();
    mockFacilitiesApi({ apiVersion: 2 });
    mockClinicApi({ locations: ['983'], apiVersion: 2 });

    mockDirectScheduleSlotsApi({ clinicId: '455', start, end, apiVersion: 2 });
    mockUserTransitionAvailabilities();

    cy.visit('my-health/appointments');
    cy.injectAxe();

    cy.wait(['@v2:get:appointments']);

    cy.axeCheckBestPractice();

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
    cy.contains('button', /Continue/i).click();

    // Contact Facility Page
    cy.url().should('include', '/contact-facility');
    cy.contains('button', /Continue/i).should('not.exist');
  });
});
