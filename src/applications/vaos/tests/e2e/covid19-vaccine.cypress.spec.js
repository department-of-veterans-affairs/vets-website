import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';

import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockClinicApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockDirectScheduleSlotsApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockLoginApi,
  mockRequestEligibilityCriteriaApi,
  vaosSetup,
} from './vaos-cypress-helpers';

describe('VAOS COVID-19 vaccine appointment flow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectBookingEligibilityCriteriaApi({
      facilityIds: ['983', '983QA'],
      typeOfCareId: 'covid',
    });
    mockDirectScheduleSlotsApi(); // TODO: rename mockAppointmentSlots
    mockFacilitiesApi({ apiVersion: 1 });
    mockFacilityApi({ id: '983', apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi({ withoutAddress: true });
    mockRequestEligibilityCriteriaApi();
  });

  it('should submit form', () => {
    cy.visit('health-care/schedule-view-va-appointments/appointments');
    cy.injectAxe();

    cy.wait([
      '@v0:get:appointments:va',
      '@v0:get:appointments:cc',
      '@v0:get:appointment:requests',
      '@v1:get:facilities',
    ]);

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
    cy.wait([
      '@v0:get:request_eligibility_criteria',
      '@v0:get:direct_booking_eligibility_criteria',
    ]);
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
    cy.wait('@v0:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.clinic.siteCode).to.eq('983');
      expect(body.clinic.clinicId).to.eq('455');
      expect(body).to.have.property(
        'desiredDate',
        `${moment()
          .add(1, 'day')
          .add(1, 'months')
          .startOf('month')
          .day(9)
          .startOf('day')
          .format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body).to.have.property('dateTime');
      expect(body).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    // Confirmation page
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findAllByText('COVID-19 vaccine');
    cy.findByText('Clinic:');
  });

  it('should show facility contact page on second dose selection', () => {
    cy.visit('health-care/schedule-view-va-appointments/appointments');
    cy.injectAxe();

    cy.wait([
      '@v0:get:appointments:va',
      '@v0:get:appointments:cc',
      '@v0:get:appointment:requests',
      '@v1:get:facilities',
    ]);

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
    cy.findByText(/Continue/).click();

    // Contact Facility Page
    cy.url().should('include', '/contact-facility');
    cy.findByText(/Continue/i).should('not.exist');
  });
});

describe('VAOS COVID-19 vaccine appointment flow - unavailable', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectBookingEligibilityCriteriaApi({ unableToScheduleCovid: true });
    mockDirectScheduleSlotsApi(); // TODO: rename mockAppointmentSlots
    mockFacilitiesApi({ apiVersion: 1 });
    mockFacilityApi({ id: '983', apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi();
    mockRequestEligibilityCriteriaApi();
  });

  it('should show facility contact page when vaccine schedule is not available', () => {
    cy.visit('health-care/schedule-view-va-appointments/appointments');
    cy.injectAxe();

    cy.wait([
      '@v0:get:appointments:va',
      '@v0:get:appointments:cc',
      '@v0:get:appointment:requests',
    ]);

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

    // Contact Facility Page
    cy.url().should('include', '/contact-facility');
    cy.wait([
      '@v0:get:request_eligibility_criteria',
      '@v0:get:direct_booking_eligibility_criteria',
      '@v1:get:facilities',
    ]).then(() => {
      cy.findByText('Your facilities');
      cy.axeCheckBestPractice();
      cy.findByText(/Continue/i).should('not.exist');
    });
  });
});
