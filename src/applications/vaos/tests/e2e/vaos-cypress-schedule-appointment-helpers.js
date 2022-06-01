import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';

const today = moment();

export function chooseTypeOfCareTest(label) {
  cy.url().should('include', '/new-appointment', { timeout: Timeouts.slow });
  cy.axeCheckBestPractice();
  cy.findByLabelText(label)
    .focus()
    .click();
  cy.findByText(/Continue/).click();
}

export function chooseFacilityTypeTest(label) {
  cy.url().should('include', '/choose-facility-type');
  cy.axeCheckBestPractice();
  cy.findByLabelText(label).click();
  cy.findByText(/Continue/).click();
}

export function chooseVAFacilityTest() {
  cy.url().should('include', '/va-facility');
  cy.axeCheckBestPractice();
  cy.findByLabelText(/CHYSHR/).check();
  cy.findByLabelText(
    'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
  ).click();
  cy.findByText(/Continue/).click();
}

export function chooseVAFacilityV2Test(label) {
  cy.url().should('include', '/va-facility-2');
  cy.axeCheckBestPractice();
  cy.findByLabelText(label)
    .focus()
    .click();
  cy.findByText(/Continue/).click();
}

export function chooseClinicTest() {
  cy.url().should('include', '/clinics');
  cy.axeCheckBestPractice();
  cy.findByText(
    /Choose a clinic below or request a different clinic for this appointment/i,
  );
  cy.get('#root_clinicId_0')
    .focus()
    .click();
  cy.findByText(/Continue/).click();
}

export function choosePreferredDateTest() {
  cy.url().should('include', '/preferred-date');
  cy.axeCheckBestPractice();

  const preferredDate = today
    .clone()
    .add(1, 'month')
    .startOf('month')
    .add(4, 'days');

  cy.findByLabelText('Month').select(preferredDate.format('MMMM'));
  cy.findByLabelText('Day').select(preferredDate.format('D'));
  cy.findByLabelText('Year').type(preferredDate.format('YYYY'));
  cy.findByText(/Continue/).click();
}

export function selectTimeSlotTest() {
  cy.url().should('include', '/select-date');
  cy.findByText(/Finding appointment availability.../i).should('not.exist');
  cy.waitUntil(() =>
    cy
      .get('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
      .focus()
      .click()
      .get(
        '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
      ),
  )
    .focus()
    .click();

  cy.axeCheckBestPractice();
  cy.findByText(/Continue/).click();
}

export function selectRequestSlotTest() {
  cy.url().should('include', '/request-date');
  cy.contains('button', 'Next')
    .focus()
    .click();
  cy.get('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
    .first()
    .click();
  cy.get(
    '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
  ).click();
  cy.axeCheckBestPractice();
  cy.findByText(/Continue/).click();
}

export function howToBeSeenTest() {
  cy.url().should('include', '/choose-visit-type');
  cy.findByLabelText(/Office/i).click();
  cy.axeCheckBestPractice();
  cy.findByText(/Continue/).click();
}

export function reasonForAppointmentTest(
  content,
  label = /Please provide any additional details/,
) {
  cy.url().should('include', '/reason-appointment');
  cy.axeCheckBestPractice();
  cy.findByLabelText(/Routine or follow-up visit/i).click();
  cy.findByLabelText(label).type(content);
  cy.findByText(/Continue/).click();
}

export function contactInfoTest() {
  cy.url().should('include', '/contact-info');
  cy.axeCheckBestPractice();
  cy.findByLabelText(/Morning/).click();
  cy.findByText(/Continue/).click();
}

export function contactInfoDirectScheduleTest() {
  cy.url().should('include', '/contact-info');
  cy.axeCheckBestPractice();

  // Adding this to solve weird timing error. These fields should be pre-populated but
  // sometimes they are not.
  cy.get('#root_phoneNumber')
    .clear()
    .type('5035551234');
  cy.get('#root_email')
    .clear()
    .type('veteran@gmail.com');

  // cy.findByLabelText(/Morning/).click();
  cy.findByText(/Continue/).click();
}

export function reviewTest() {
  cy.url().should('include', '/review');
  cy.axeCheckBestPractice();
  cy.findByText('Confirm appointment').click();
}

export function confirmationPageV2Test(
  fullReason = '',
  isAppointmentRequest = true,
) {
  if (isAppointmentRequest) {
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findByText('VA Appointment');
    cy.findByText('Your reason for your visit');
    cy.findByText(fullReason);
    cy.axeCheckBestPractice();
  } else {
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findByRole('heading', { level: 2, name: /VA Appointment/i });
    cy.axeCheckBestPractice();
  }
}
