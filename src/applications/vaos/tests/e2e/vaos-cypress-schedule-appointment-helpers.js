import moment from 'moment';

const today = moment();

export function chooseTypeOfCareTest(label) {
  cy.url().should('include', '/new-appointment');
  cy.axeCheck();
  cy.findByLabelText(label).click();
  cy.findByText(/Continue/).click();
}

export function chooseVAFacilityTest() {
  cy.url().should('include', '/va-facility');
  cy.axeCheck();
  cy.findByLabelText(/CHYSHR/).click();
  cy.findByLabelText(
    'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
  ).click();
  cy.findByText(/Continue/).click();
}

export function chooseClinicTest() {
  cy.url().should('include', '/clinics');
  cy.axeCheck();
  cy.findByLabelText('CHY PC CASSIDY').click();
  cy.findByText(/Continue/).click();
}

export function choosePreferredDateTest() {
  cy.url().should('include', '/preferred-date');
  cy.axeCheck();

  const preferredDate = today.add(4, 'days');

  cy.findByLabelText('Month').select(preferredDate.format('MMM'));
  cy.findByLabelText('Day').select(preferredDate.format('D'));
  cy.findByLabelText('Year').type(preferredDate.format('YYYY'));
  cy.findByText(/Continue/).click();
}

export function selectTimeSlotTest() {
  cy.url().should('include', '/select-date');
  cy.get(
    '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])',
  ).click();
  cy.get(
    '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
  ).click();
  cy.axeCheck();
  cy.findByText(/Continue/).click();
}

export function reasonForAppointmentTest(l) {
  cy.url().should('include', '/reason-appointment');
  cy.axeCheck();
  cy.findByLabelText('Routine or follow-up visit').click();
  cy.findByLabelText(/Please provide any additional details/).type(l);
  cy.findByText(/Continue/).click();
}

export function contactInfoTest() {
  cy.url().should('include', '/contact-info');
  cy.axeCheck();
  cy.findByLabelText(/Morning/).click();
  cy.findByText(/Continue/).click();
}

export function reviewTest() {
  cy.url().should('include', '/review');
  cy.axeCheck();
  cy.findByText('Confirm appointment').click();
}

export function confirmationPageTest(additionalInfo) {
  cy.findByText('Your appointment has been scheduled');
  cy.findByText('VA Appointment');
  cy.findByText('Follow-up/Routine');
  cy.findByText(additionalInfo);
}
