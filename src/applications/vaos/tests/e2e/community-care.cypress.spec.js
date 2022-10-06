import Timeouts from 'platform/testing/e2e/timeouts';
import {
  mockFeatureToggles,
  vaosSetup,
  mockPreferencesApi,
  mockAppointmentsApi,
  mockAppointmentRequestsApi,
  mockLoginApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockSupportedSitesApi,
  mockCCEligibilityApi,
  mockAppointmentRequestMessagesApi,
  mockFacilityApi,
  mockSchedulingConfigurationApi,
} from './vaos-cypress-helpers';

describe('VAOS community care flow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestMessagesApi();
    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockCCEligibilityApi();
    mockCCProvidersApi();
    mockFacilitiesApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockPreferencesApi();
    mockSupportedSitesApi();
  });

  it('should fill out community care form and submit request', () => {
    mockLoginApi({ withoutAddress: true });

    cy.visit(
      'health-care/schedule-view-va-appointments/appointments/new-appointment/',
    );

    // Wait until the app has been bootstraped. Could have used 'cy.wait' but
    // this is considered an 'anti-pattern'. Tried to wait for the loading
    // indicator but multiple indicators are displayed. So, we are waiting for
    // the appointment cards to be displayed.
    cy.findAllByRole('link', {
      name: /Details for appointment/,
      timeout: 6000,
    }).should('exist');

    // we should re-direct to home page
    cy.get('h2', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain', 'Your appointments');

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    cy.injectAxe();
    // Select primary care
    cy.get('input[value="323"]', { timeout: Timeouts.slow })
      .should('exist')
      .then(checkbox => {
        cy.wrap(checkbox)
          .focus()
          .check();
      });
    // Verify primary care checked
    cy.get('input[value="323"]').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Choose where you want to receive your care step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-facility-type',
    );
    cy.axeCheckBestPractice();
    // Select community care
    cy.get('#root_facilityType_1').click();
    // Verify community care checked
    cy.get('#root_facilityType_1').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Choose an appointment day and time step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/request-date',
    );
    cy.axeCheckBestPractice();
    cy.contains('button', 'Next')
      .focus()
      .click();
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
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // What's the closest city to you step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-closest-city',
    );
    cy.axeCheckBestPractice();
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    cy.get('[aria-describedby=providerSelectionDescription]').click();
    // Choose a provider
    cy.get('#root_communityCareProvider_1').click();
    cy.get('#root_communityCareProvider_1').should('be.checked');
    cy.get('.form-radio-buttons > button').click();
    // Verify selected provider
    cy.get('#providerPostSelectionHeader').contains(/Selected provider/i);
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Tell us the reason for this appointment step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/reason-appointment',
    );
    cy.axeCheckBestPractice();
    // Fill out reason input
    cy.get('#root_reasonAdditionalInfo')
      .type('This is a very good reason.')
      .tab();
    cy.get('#root_reasonAdditionalInfo').should(
      'have.value',
      'This is a very good reason.',
    );
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Your contact information step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/contact-info',
    );
    cy.axeCheckBestPractice();
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
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Review your appointment details step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    cy.axeCheckBestPractice();
    // Click request appointment button
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@v0:create:appointment:request').should(xhr => {
      const { body } = xhr.request;

      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=cc',
      );
      cy.assertRequestedPeriod(body.optionDate1);
      expect(body)
        .to.have.property('optionDate2')
        .to.equal('No Date Selected');
      expect(body)
        .to.have.property('optionDate3')
        .to.equal('No Date Selected');
      expect(Cypress._.values(body.preferredProviders)).to.deep.eq([
        {
          address: {
            city: 'WASHINGTON',
            state: 'DC',
            street: '1012 14TH ST NW STE 700',
            zipCode: '20005-3477',
          },
          practiceName: 'Doe, Jane',
        },
      ]);
      expect(body).to.have.property(
        'newMessage',
        'This is a very good reason.',
      );
      expect(body.facility.facilityCode).to.eq('983');
      expect(body.facility.parentSiteCode).to.eq('983');
      expect(body).to.have.property('typeOfCareId', 'CCPRMYRTNE');
      expect(body).to.have.property('optionTime1', 'AM');
      expect(body).to.have.property('optionTime2', 'No Time Selected');
      expect(body).to.have.property('optionTime3', 'No Time Selected');
      expect(body).to.have.property('email', 'veteran@gmail.com');
      expect(body).to.have.property('phoneNumber', '5035551234');
    });

    // Check messages requestBody is as expected
    cy.wait('@v0:get:messages').should(xhr => {
      const { body } = xhr.response;
      expect(body.data).to.have.property(
        'messageText',
        'This is a very good reason.',
      );
    });

    // Your appointment request has been submitted step
    cy.url().should('include', '/requests/testing');
    cy.findByText('Preferred community care provider');
    cy.findByText(/your appointment request has been submitted/i);
    cy.axeCheckBestPractice();
  });

  it('should submit form with provider chosen from list and submit request', () => {
    mockLoginApi();

    cy.visit(
      'health-care/schedule-view-va-appointments/appointments/new-appointment/',
    );

    cy.findAllByRole('link', {
      name: /Details for appointment/,
      timeout: 6000,
    }).should('exist');

    // we should re-direct to home page
    cy.get('h2', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain', 'Your appointments');

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    cy.injectAxe();
    // Select primary care
    cy.get('input[value="323"]')
      .should('exist')
      .then(checkbox => {
        cy.wrap(checkbox)
          .focus()
          .check();
      });
    // Verify primary care checked
    cy.get('input[value="323"]').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Choose where you want to receive your care step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-facility-type',
    );
    cy.axeCheckBestPractice();
    // Select community care
    cy.get('#root_facilityType_1').click();
    // Verify community care checked
    cy.get('#root_facilityType_1').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Choose an appointment day and time step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/request-date',
    );
    cy.axeCheckBestPractice();
    cy.contains('button', 'Next')
      .focus()
      .click();
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
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // What's the closest city to you step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-closest-city',
    );
    cy.axeCheckBestPractice();

    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    cy.findByText(/Choose a provider/).click();

    cy.findByLabelText(/doe, jane/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Choose provider/i).click();
    cy.findByText(/remove/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/cancel/i).click();
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-language',
    );
    cy.axeCheckBestPractice();
    // Select preferred language
    cy.get('#root_preferredLanguage').select('english');
    cy.get('#root_preferredLanguage').should('have.value', 'english');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Tell us the reason for this appointment step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/reason-appointment',
    );
    cy.axeCheckBestPractice();
    // Fill out reason input
    cy.get('#root_reasonAdditionalInfo')
      .type('This is a very good reason.')
      .tab();
    cy.get('#root_reasonAdditionalInfo').should(
      'have.value',
      'This is a very good reason.',
    );
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Your contact information step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/contact-info',
    );
    cy.axeCheckBestPractice();
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
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Review your appointment details step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    cy.axeCheckBestPractice();
    // Click request appointment button
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@v0:create:appointment:request').should(xhr => {
      const { body } = xhr.request;

      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=cc',
      );
      cy.assertRequestedPeriod(body.optionDate1);
      expect(body)
        .to.have.property('optionDate2')
        .to.equal('No Date Selected');
      expect(body)
        .to.have.property('optionDate3')
        .to.equal('No Date Selected');
      expect(Cypress._.values(body.preferredProviders)).to.deep.eq([
        {
          address: {
            city: 'WASHINGTON',
            state: 'DC',
            street: '1012 14TH ST NW STE 700',
            zipCode: '20005-3477',
          },
          practiceName: 'Doe, Jane',
        },
      ]);
      expect(body).to.have.property(
        'newMessage',
        'This is a very good reason.',
      );
      expect(body.facility.facilityCode).to.eq('983');
      expect(body.facility.parentSiteCode).to.eq('983');
      expect(body).to.have.property('typeOfCareId', 'CCPRMYRTNE');
      expect(body).to.have.property('optionTime1', 'AM');
      expect(body).to.have.property('optionTime2', 'No Time Selected');
      expect(body).to.have.property('optionTime3', 'No Time Selected');
      expect(body).to.have.property('email', 'veteran@gmail.com');
      expect(body).to.have.property('phoneNumber', '5035551234');
    });

    // Check messages requestBody is as expected
    cy.wait('@v0:get:messages').should(xhr => {
      const { body } = xhr.response;
      expect(body.data).to.have.property(
        'messageText',
        'This is a very good reason.',
      );
    });

    // Your appointment request has been submitted step
    cy.url().should('include', '/requests/testing');
    cy.findByText('Preferred community care provider');
    cy.findByText(/your appointment request has been submitted/i);
    cy.axeCheckBestPractice();
  });
});
// skipped due to failures around accurate test naming convention
describe.skip('VAOS community care flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi({ apiVersion: 2 });
    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockCCEligibilityApi();
    mockCCProvidersApi();
    mockFacilitiesApi({ apiVersion: 2 });
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFacilityApi({ id: 'vha_442', apiVersion: 1 });
    mockFeatureToggles({ v2Requests: true, v2Facilities: true });
    mockLoginApi();
    mockPreferencesApi();
    mockSchedulingConfigurationApi();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
  });

  it('should submit request successfully', () => {
    // Select primary care
    cy.get('input[value="323"]')
      .should('exist')
      .then(checkbox => {
        cy.wrap(checkbox)
          .focus()
          .check();
      });

    // Verify primary care checked
    cy.get('input[value="323"]').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Choose where you want to receive your care step
    cy.url().should('contain', 'new-appointment/choose-facility-type');
    cy.axeCheckBestPractice();
    // Select community care
    cy.get('#root_facilityType_1').click();
    // Verify community care checked
    cy.get('#root_facilityType_1').should('be.checked');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Choose an appointment day and time step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/request-date',
    );
    cy.axeCheckBestPractice();
    cy.contains('button', 'Next')
      .focus()
      .click();
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
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // What's the closest city to you step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-closest-city',
    );
    cy.axeCheckBestPractice();

    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    cy.findByText(/Choose a provider/).click();

    cy.findByLabelText(/doe, jane/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Choose provider/i).click();
    cy.findByText(/remove/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/cancel/i).click();
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-language',
    );
    cy.axeCheckBestPractice();
    // Select preferred language
    cy.get('#root_preferredLanguage').select('english');
    cy.get('#root_preferredLanguage').should('have.value', 'english');
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Tell us the reason for this appointment step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/reason-appointment',
    );
    cy.axeCheckBestPractice();
    // Fill out reason input
    cy.get('#root_reasonAdditionalInfo')
      .type('This is a very good reason.')
      .tab();
    cy.get('#root_reasonAdditionalInfo').should(
      'have.value',
      'This is a very good reason.',
    );
    // Click continue button
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Your contact information step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/contact-info',
    );
    cy.axeCheckBestPractice();
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
    cy.get('.usa-button')
      .contains('Continue')
      .click();

    // Review your appointment details step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    cy.axeCheckBestPractice();
    // Click request appointment button
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@v2:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain('/vaos/v2/appointments');
      // expect(request.requestedPeriods[0].start).to.equal(date);
      cy.assertRequestedPeriod(body.requestedPeriods[0].start);
      expect(body.practitioners).to.deep.eq([
        {
          address: {
            city: 'WASHINGTON',
            line: ['1012 14TH ST NW STE 700'],
            postalCode: '20005-3477',
            state: 'DC',
          },
          identifier: [
            {
              system: 'http://hl7.org/fhir/sid/us-npi',
              value: '1497723753',
            },
          ],
        },
      ]);

      expect(body.locationId).to.eq('983');
      expect(body).to.have.property('serviceType', 'primaryCare');
      expect(body).to.have.property('kind', 'cc');
      expect(body.contact.telecom[1].value).to.equal('veteran@gmail.com');
      expect(body.contact.telecom[0].value).to.equal('5035551234');
    });
    cy.url().should('include', '/requests/mock1');
    cy.findByText('Preferred community care provider');
  });
});
