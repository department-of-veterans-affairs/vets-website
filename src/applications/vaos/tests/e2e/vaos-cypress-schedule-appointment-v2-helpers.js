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
  cy.wait(['@facility', '@scheduling-configurations', '@eligibility-cc']);
  cy.url().should('include', '/choose-facility-type');
  cy.axeCheckBestPractice();
  cy.findByLabelText(label).click();
  cy.findByText(/Continue/).click();
}

export function chooseVAFacilityTest(facilityId = '983') {
  cy.wait(['@facility', '@scheduling-configurations']);
  cy.url().should('include', '/va-facility-2');
  cy.axeCheckBestPractice();
  cy.get(
    `${facilityId === '983' ? '#root_vaFacility_1' : '#root_vaFacility_2'}`,
  )
    .focus()
    .click();
  cy.findByText(/Continue/).click();
}

export function chooseClinicTest() {
  cy.url().should('include', '/clinics');
  cy.axeCheckBestPractice();
  cy.findByRole('heading', { level: 1, name: /Choose a VA clinic/i });
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
    // .add(1, 'month')
    // .startOf('month');
    .add(2, 'days');

  cy.findByLabelText('Month').select(preferredDate.format('MMMM'));
  cy.findByLabelText('Day').select(preferredDate.format('D'));
  cy.findByLabelText('Year').type(preferredDate.format('YYYY'));
  cy.findByText(/Continue/).click();
}

export function selectTimeSlotTest(dayLabel, slotLabel) {
  cy.wait('@slots');

  cy.url().should('include', '/select-date');
  cy.findByText(/Finding appointment availability.../i).should('not.exist');
  cy.waitUntil(() =>
    cy
      .get('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
      .contains(dayLabel)
      .focus()
      .click()
      .get(
        '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
      ),
  )
    .focus()
    .click();

  // cy.contains('20');
  cy.contains(slotLabel);
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
  cy.get('#root_phoneNumber')
    .clear()
    .type('5035551234');
  cy.get('#root_email')
    .clear()
    .type('veteran@gmail.com');
  cy.findByText(/Continue/).click();
}

export function reviewTest() {
  cy.url().should('include', '/review');
  cy.axeCheckBestPractice();
  cy.findByText('Confirm appointment').click();
}

export function confirmationPageV2Test(fullReason) {
  cy.findByText('We’ve scheduled and confirmed your appointment.');
  cy.findByText('VA Appointment');
  cy.findByText('Your reason for your visit');
  cy.findByText(fullReason);
  cy.axeCheckBestPractice();
}
