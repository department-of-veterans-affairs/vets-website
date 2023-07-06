import Timeouts from 'platform/testing/e2e/timeouts';
import moment from 'moment';
import {
  mockFeatureToggles,
  vaosSetup,
  mockAppointmentsApi,
  mockLoginApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockSchedulingConfigurationApi,
  mockUserTransitionAvailabilities,
  mockAppointmentApi,
  mockVamcEhr,
  mockGetEligibilityCC,
} from '../vaos-cypress-helpers';

describe('VAOS community care flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ data: [], apiVersion: 2 });
    mockCCProvidersApi();
    mockFacilitiesApi({ apiVersion: 2 });
    mockFeatureToggles({ v2Requests: true, v2Facilities: true });
    mockLoginApi();
    mockSchedulingConfigurationApi();
    mockUserTransitionAvailabilities();
    mockVamcEhr();

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
  });

  it('should submit request successfully', () => {
    const data = [
      {
        id: '1',
        type: 'Appointment',
        attributes: {
          id: 1,
          kind: 'cc',
          // locationId: '983QA',
          start: moment()
            // .subtract(1, 'day')
            .format('YYYY-MM-DDTHH:mm:ss'),
          status: 'booked',
        },
      },
    ];

    mockAppointmentApi({
      data: {
        id: 'mock1',
        type: 'Appointment',
        attributes: {
          contact: {
            telecom: [
              { type: 'phone', value: '5035551234' },
              { type: 'email', value: 'veteran@gmail.com' },
            ],
          },
          id: 'mock1',
          kind: 'cc',
          locationId: '983',
          preferredTimesForPhoneCall: ['Morning', 'Evening'],
          reasonCode: { text: 'This is a very good reason.' },
          requestedPeriods: [
            {
              start: moment().format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD'),
            },
          ],
          serviceType: 'primaryCare',
          status: 'pending',
        },
      },
      id: 'mock1',
    });
    mockAppointmentsApi({ data, apiVersion: 2 });
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockGetEligibilityCC();

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
      // cy.assertRequestedPeriod(body.requestedPeriods[0].start);
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
      expect(body.preferredLanguage).to.equal('English');
      expect(body.preferredLocation).to.deep.equal({
        city: 'Cheyenne',
        state: 'WY',
      });
      expect(body.preferredTimesForPhoneCall).to.have.ordered.members([
        'Morning',
        'Evening',
      ]);
      expect(body.reasonCode.text).to.equal('This is a very good reason.');
      expect(body.requestedPeriods).not.to.be.empty;
      expect(body.status).to.equal('proposed');
    });

    // Request detail page should display the same information sent to create the
    // appointment.
    cy.url().should('include', '/requests/mock1');
    cy.wait('@v2:get:appointment');
    cy.findByText('Pending primary care appointment');
    cy.findByText('Your appointment request has been submitted.');
    cy.findByText('This is a very good reason.');
    cy.findByText('veteran@gmail.com');
    // cy.findByText('503-555-1234');
    cy.findByText('Call morning or evening');
    cy.axeCheckBestPractice();
  });

  it.skip('should submit form with provider chosen from list and submit request', () => {
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

    // Your appointment request has been submitted step
    cy.url().should('include', '/requests/testing');
    cy.findByText('Preferred community care provider');
    cy.findByText(/your appointment request has been submitted/i);
    cy.axeCheckBestPractice();
  });
});
