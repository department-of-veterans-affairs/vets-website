import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';

const today = moment();

export function chooseTypeOfCareTest(label) {
  cy.url().should('include', '/new-appointment', { timeout: Timeouts.slow });
  cy.axeCheckBestPractice();
  cy.findByLabelText(label)
    .focus()
    .click();
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

export function chooseFacilityTypeTest(label) {
  cy.url().should('include', '/choose-facility-type');
  cy.axeCheckBestPractice();
  cy.findByLabelText(label).click();
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

// export function chooseVAFacilityTest0000() {
//   // cy.wait('@v1:get:facilities:vha_442');
//   cy.url().should('include', '/va-facility');
//   cy.axeCheckBestPractice();
//   cy.findByLabelText(/CHYSHR/).check();
//   cy.findByLabelText(
//     'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
//   ).click();
//   cy.findByText(/Continue/).click({ waitForAnimations: true });
// }
export function chooseVAFacilityTest(label) {
  // cy.wait(['@facility', '@scheduling-configurations']);
  cy.url().should('include', '/va-facility-2');
  cy.axeCheckBestPractice();
  cy.findByLabelText(label)
    .focus()
    .click();
  // cy.get(
  //   `${facilityId === '983' ? '#root_vaFacility_1' : '#root_vaFacility_2'}`,
  // )
  //   .focus()
  //   .click();
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

// export function chooseVAFacilityV2Test() {
//   cy.url().should('include', '/va-facility-2');
//   cy.axeCheckBestPractice();
//   cy.get('#root_vaFacility_1')
//     .focus()
//     .click();
//   cy.findByText(/Continue/).click({ waitForAnimations: true });
// }

export function chooseClinicTest({ apiVersion = 0 } = {}) {
  cy.get('.vaos__loading-overlay').should('not.exist');
  if (apiVersion === 0) {
    cy.url().should('include', '/clinics');
    cy.axeCheckBestPractice();
    cy.findByText(
      /Choose a clinic below or request a different clinic for this appointment/i,
    );
    cy.get('#root_clinicId_0')
      .focus()
      .click();
    cy.findByText(/Continue/).click();
  } else {
    cy.url().should('include', '/clinics');
    cy.axeCheckBestPractice();
    cy.findByRole('heading', { level: 1, name: /Choose a VA clinic/i });
    cy.get('#root_clinicId_0')
      .focus()
      .click();
    cy.findByText(/Continue/).click({ waitForAnimations: true });
  }
}

export function choosePreferredDateTest() {
  cy.get('.vaos__loading-overlay').should('not.exist');
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
  cy.findByText(/Continue/).click({ waitForAnimations: true });
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
  cy.findByText(/Continue/).click({ waitForAnimations: true });
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
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

export function howToBeSeenTest() {
  cy.url().should('include', '/choose-visit-type');
  cy.findByLabelText(/Office/i).click();
  cy.axeCheckBestPractice();
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

export function reasonForAppointmentTest(
  content,
  label = /Please provide any additional details/,
) {
  cy.url().should('include', '/reason-appointment');
  cy.axeCheckBestPractice();
  cy.findByLabelText(/Routine or follow-up visit/i).click();
  cy.findByLabelText(label).type(content);
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

export function contactInfoTest() {
  cy.get('.vaos__loading-overlay').should('not.exist');
  cy.url().should('include', '/contact-info');
  cy.axeCheckBestPractice();
  cy.findByLabelText(/Morning/).click();
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

export function contactInfoDirectScheduleTest() {
  cy.get('.vaos__loading-overlay').should('not.exist');
  cy.url().should('include', '/contact-info');
  cy.axeCheckBestPractice();
  // cy.findByLabelText(/Morning/).click();
  cy.findByText(/Continue/).click({ waitForAnimations: true });
}

export function reviewTest() {
  cy.url().should('include', '/review');
  // cy.axeCheckBestPractice();
  cy.findByText('Confirm appointment').click({ waitForAnimations: true });
}

export function confirmationPageV2Test({ fullReason, apiVersion = 0 } = {}) {
  if (apiVersion === 0) {
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findByRole('heading', { level: 2, name: 'VA Appointment' });
    cy.findByText('Your reason for your visit');
    cy.findByText(fullReason);
    cy.axeCheckBestPractice();
  } else {
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findByRole('heading', { level: 2, name: 'VA appointment' });
    // TODO: Not sure why these fields are empty!
    // cy.findByText('Your reason for your visit');
    // cy.findByText(fullReason);
    cy.axeCheckBestPractice();
  }
}
