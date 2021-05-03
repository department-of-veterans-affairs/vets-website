import moment from 'moment';

const today = moment();

export function chooseTypeOfCareTest(label) {
  cy.url().should('include', '/new-appointment');
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

export function chooseVAFacilityV2Test() {
  cy.url().should('include', '/va-facility-2');
  cy.axeCheckBestPractice();
  cy.get('#root_vaFacility_3')
    .focus()
    .click();
  cy.findByText(/Continue/).click();
}

export function chooseClinicTest() {
  cy.url().should('include', '/clinics');
  cy.axeCheckBestPractice();
  cy.findByText(/You can choose a clinic where you’ve been seen/i);
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
  cy.findByLabelText('Routine or follow-up visit').click();
  cy.findByLabelText(label).type(content);
  cy.findByText(/Continue/).click();
}

export function contactInfoTest() {
  cy.url().should('include', '/contact-info');
  cy.axeCheckBestPractice();
  cy.findByLabelText(/Morning/).click();
  cy.findByText(/Continue/).click();
}

export function reviewTest() {
  cy.url().should('include', '/review');
  cy.axeCheckBestPractice();
  cy.findByText('Confirm appointment').click();
}

export function confirmationPageTest(additionalInfo) {
  cy.findByText('Your appointment has been scheduled');
  cy.findByText('VA Appointment');
  cy.findByText('Follow-up/Routine');
  cy.findByText(additionalInfo);
}

export function confirmationPageV2Test(fullReason) {
  cy.findByText('Your appointment has been scheduled and is confirmed.');
  cy.findByText('VA Appointment');
  cy.findByText('Your reason for your visit');
  cy.findByText(fullReason);
}
