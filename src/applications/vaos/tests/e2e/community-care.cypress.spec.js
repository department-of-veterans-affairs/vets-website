import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import { initCommunityCareMock, vaosSetup } from './vaos-cypress-helpers';
import {
  mockAppointmentsApi,
  mockCCPrimaryCareEligibility,
  mockCCProviderApi,
  mockClinicApi,
  mockEligibilityApi,
  mockFacilityApi,
  mockFeatureToggleApi,
  mockGetSchedulingConfiguration,
  mockLoginApi,
  mockPreferencesApi,
} from './vaos-cypress-routes';

describe('VAOS community care flow', () => {
  it('should fill out community care form and submit request', () => {
    initCommunityCareMock({ withoutAddress: true });
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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

    // What's the closest city to you step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-closest-city',
    );
    cy.axeCheckBestPractice();
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    // Click continue button
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

    // Review your appointment details step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    cy.axeCheckBestPractice();
    // Click continue button
    cy.get('.usa-button').click();

    // Check form requestBody is as expected
    cy.wait('@v0:create:request').should(xhr => {
      let date = moment()
        .add(5, 'days')
        .add(1, 'months')
        .startOf('month');

      // Check for weekend and select following Monday if true
      if (date.weekday() === 0) {
        date = date.add(1, 'days').format('MM/DD/YYYY');
      } else if (date.weekday() === 6) {
        date = date.add(2, 'days').format('MM/DD/YYYY');
      } else {
        date = date.format('MM/DD/YYYY');
      }

      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=cc',
      );
      const { body } = xhr.request;
      expect(body)
        .to.have.property('optionDate1')
        .to.equal(date);
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
          practiceName: 'CAMPBELL, WILLIAM',
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
    cy.wait('@v0:create:request-message').should(xhr => {
      const { body } = xhr.request;
      expect(body).to.have.property(
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
    initCommunityCareMock();
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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

    // What's the closest city to you step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-closest-city',
    );
    cy.axeCheckBestPractice();

    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    cy.get('.usa-button').click();

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    cy.findByText(/Choose a provider/).click({ waitForAnimations: true });

    cy.findByLabelText(/campbell, william/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Choose provider/i).click({ waitForAnimations: true });
    cy.findByText(/remove/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/cancel/i).click();
    // Click continue button
    cy.get('.usa-button').click();

    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-language',
    );
    cy.axeCheckBestPractice();
    // Select preferred language
    cy.get('#root_preferredLanguage').select('english');
    cy.get('#root_preferredLanguage').should('have.value', 'english');
    // Click continue button
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

    // Review your appointment details step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    cy.axeCheckBestPractice();
    // Click continue button
    cy.get('.usa-button').click();

    // Check form requestBody is as expected
    cy.wait('@v0:create:request').should(xhr => {
      let date = moment()
        .add(5, 'days')
        .add(1, 'months')
        .startOf('month');

      // Check for weekend and select following Monday if true
      if (date.weekday() === 0) {
        date = date.add(1, 'days').format('MM/DD/YYYY');
      } else if (date.weekday() === 6) {
        date = date.add(2, 'days').format('MM/DD/YYYY');
      } else {
        date = date.format('MM/DD/YYYY');
      }

      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=cc',
      );
      const { body } = xhr.request;
      expect(body)
        .to.have.property('optionDate1')
        .to.equal(date);
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
          practiceName: 'CAMPBELL, WILLIAM',
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
    cy.wait('@v0:create:request-message').should(xhr => {
      const { body } = xhr.request;
      expect(body).to.have.property(
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

describe('VAOS community care flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();
  });

  it('should submit request successfully', () => {
    mockAppointmentsApi({ id: '983', apiVersion: 0 });
    mockAppointmentsApi({ id: '983', apiVersion: 2 });
    mockCCPrimaryCareEligibility();
    mockCCProviderApi();
    mockClinicApi({ locations: ['983', '983GC'], apiVersion: 2 });
    mockEligibilityApi();
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFeatureToggleApi();
    mockGetSchedulingConfiguration();
    mockLoginApi();
    mockPreferencesApi();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

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
    cy.get('.usa-button').click();

    // Choose where you want to receive your care step
    cy.url().should('contain', 'new-appointment/choose-facility-type');
    cy.axeCheckBestPractice();
    // Select community care
    cy.get('#root_facilityType_1').click();
    // Verify community care checked
    cy.get('#root_facilityType_1').should('be.checked');
    // Click continue button
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

    // What's the closest city to you step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/choose-closest-city',
    );
    cy.axeCheckBestPractice();

    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    cy.get('.usa-button').click();

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    cy.findByText(/Choose a provider/).click({ waitForAnimations: true });

    cy.findByLabelText(/oh, janice/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Choose provider/i).click();
    cy.findByText(/remove/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/cancel/i).click();
    // Click continue button
    cy.get('.usa-button').click();

    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-language',
    );
    cy.axeCheckBestPractice();
    // Select preferred language
    cy.get('#root_preferredLanguage').select('english');
    cy.get('#root_preferredLanguage').should('have.value', 'english');
    // Click continue button
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

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
    cy.get('.usa-button').click();

    // Review your appointment details step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/review',
    );
    cy.axeCheckBestPractice();
    // Click continue button
    cy.get('.usa-button').click();

    // Check form requestBody is as expected
    cy.wait('@v2:create:appointment').should(xhr => {
      let date = moment()
        .add(5, 'days')
        .add(1, 'months')
        .startOf('month');

      // Check for weekend and select following Monday if true
      if (date.weekday() === 0) {
        date = date.add(1, 'days').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      } else if (date.weekday() === 6) {
        date = date.add(2, 'days').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      } else {
        date = date.format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      }

      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.url, 'post url').to.contain('/vaos/v2/appointments');
      const { body } = xhr.request;
      expect(body.requestedPeriods[0].start).to.equal(date);
      expect(body.practitioners).to.deep.eq([
        {
          address: {
            city: 'ANNANDALE',
            line: ['7700 LITTLE RIVER TPKE STE 102'],
            postalCode: '22003-2400',
            state: 'VA',
          },
          identifier: [
            {
              system: 'http://hl7.org/fhir/sid/us-npi',
              value: '1952935777',
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
