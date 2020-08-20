import { initAppointmentListMock } from './vaos-cypress-helpers';

describe('Create new community care appointment', () => {
  beforeEach(() => {
    initAppointmentListMock();
    // Stub out Google Analytics call
    cy.route({
      method: 'POST',
      url: '/r/collect',
      status: 200,
      response: [],
    });
    cy.route({
      method: 'POST',
      url: '/j/collect',
      status: 200,
      response: [],
    });
    // Stub out socks call
    cy.route({
      method: 'GET',
      url: '/sockjs-node/*',
      status: 200,
      response:
        '{"websocket":true,"origins":["*:*"],"cookie_needed":false,"entropy":3380089859}',
    });

    cy.visit(
      'health-care/schedule-view-va-appointments/appointments/new-appointment/',
    );
  });

  it('should render choose the type of care you need', () => {
    // Select primary care
    cy.get('#root_typeOfCareId_8').click();
    // Verify primary care checked
    cy.get('#root_typeOfCareId_8').should('be.checked');
    // Click continue button
    cy.get('.usa-button').click();

    // Choose where you want to receive your care step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-facility-type',
    );
    // Select community care
    cy.get('#root_facilityType_1').click();
    // Verify community care checked
    cy.get('#root_facilityType_1').should('be.checked');
    // Click continue button
    cy.get('.usa-button').click();

    // Choose a day and time for your appointment step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/request-date',
    );
    // Select first available appointment
    cy.get('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
      .first()
      .click();
    // Select AM timeslot
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).should('be.checked');
    // Click continue button
    cy.get('.usa-button').click();

    // Tell us your community care preferences step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    // Select preferred language
    cy.get('#root_preferredLanguage').select('english');
    cy.get('#root_preferredLanguage').should('have.value', 'english');
    // Select preferred care provider
    cy.get('#root_hasCommunityCareProviderYes').click();
    cy.get('#root_hasCommunityCareProviderYes').should('be.checked');
    // Set care provider information values
    cy.get('#root_communityCareProvider_practiceName').type('practice name');
    cy.get('#root_communityCareProvider_practiceName').should(
      'have.value',
      'practice name',
    );
    cy.get('#root_communityCareProvider_firstName').type('firstname');
    cy.get('#root_communityCareProvider_firstName').should(
      'have.value',
      'firstname',
    );
    cy.get('#root_communityCareProvider_lastName').type('lastname');
    cy.get('#root_communityCareProvider_lastName').should(
      'have.value',
      'lastname',
    );
    cy.get('#root_communityCareProvider_address_street').type('address1');
    cy.get('#root_communityCareProvider_address_street').should(
      'have.value',
      'address1',
    );
    cy.get('#root_communityCareProvider_address_street2').type('address2');
    cy.get('#root_communityCareProvider_address_street2').should(
      'have.value',
      'address2',
    );
    cy.get('#root_communityCareProvider_address_city').type('city');
    cy.get('#root_communityCareProvider_address_city').should(
      'have.value',
      'city',
    );
    cy.get('#root_communityCareProvider_address_state').select('Illinois');
    cy.get('#root_communityCareProvider_address_state').should(
      'have.value',
      'IL',
    );
    cy.get('#root_communityCareProvider_address_postalCode').type('60613');
    cy.get('#root_communityCareProvider_address_postalCode').should(
      'have.value',
      '60613',
    );
    cy.get('#root_communityCareProvider_phone').type('1234567890');
    cy.get('#root_communityCareProvider_phone').should(
      'have.value',
      '1234567890',
    );
    // Click continue button
    cy.get('.usa-button').click();

    // Tell us the reason for this appointment step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/reason-appointment',
    );
    // Fill out reason input
    cy.get('#root_reasonAdditionalInfo')
      .type('This is a very good reason.')
      .tab();
    cy.get('#root_reasonAdditionalInfo').should(
      'have.value',
      'This is a very good reason.',
    );
    // Click continue button
    cy.get('.usa-button').click();

    // Your contact information step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/contact-info',
    );
    // Verify phone number
    cy.get('#root_phoneNumber').should('have.value', '5035551234');
    // Select best times for us to call morning & evening
    cy.get('#root_bestTimeToCall_morning').click();
    cy.get('#root_bestTimeToCall_morning').should('be.checked');
    cy.get('#root_bestTimeToCall_evening').click();
    cy.get('#root_bestTimeToCall_evening').should('be.checked');
    // Verify email address
    cy.get('#root_email').should('have.value', 'veteran@gmail.com');
    cy.get('#root_email').should('have.value', 'veteran@gmail.com');
    // Click continue button
    cy.get('.usa-button').click();

    // Review your appointment details step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    // Click continue button
    cy.get('.usa-button').click();

    // Your appointment request has been submitted step
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/schedule-view-va-appointments/appointments/new-appointment/confirmation',
    );
    cy.get('.usa-alert').contains(
      'Your appointment request has been submitted.',
    );
  });
});
