import moment from 'moment';

import {
  initCommunityCareMock,
  mockFeatureToggles,
  vaosSetup,
  mockUser,
} from './vaos-cypress-helpers';
import facilityData from '../../services/mocks/var/facility_data.json';
import requests from '../../services/mocks/v2/requests.json';
import facilitiesV2 from '../../services/mocks/v2/facilities.json';
import configurations from '../../services/mocks/v2/scheduling_configurations_cc.json';

describe('VAOS community care flow', () => {
  it('should fill out community care form and submit request', () => {
    initCommunityCareMock({ withoutAddress: true });
    cy.visit(
      'health-care/schedule-view-va-appointments/appointments/new-appointment/',
    );
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

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
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
    cy.wait('@appointmentRequests').should(xhr => {
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

      expect(xhr.status).to.eq(200);
      expect(xhr.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=cc',
      );
      const request = xhr.requestBody;
      expect(request)
        .to.have.property('optionDate1')
        .to.equal(date);
      expect(request)
        .to.have.property('optionDate2')
        .to.equal('No Date Selected');
      expect(request)
        .to.have.property('optionDate3')
        .to.equal('No Date Selected');
      expect(Cypress._.values(request.preferredProviders)).to.deep.eq([
        {
          address: {
            city: 'city',
            state: 'IL',
            street: 'address1, address2',
            zipCode: '60613',
          },
          firstName: 'firstname',
          lastName: 'lastname',
          practiceName: 'practice name',
          providerCity: 'city',
          providerState: 'IL',
          providerStreet: 'address1, address2',
          providerZipCode1: '60613',
        },
      ]);
      expect(request).to.have.property(
        'newMessage',
        'This is a very good reason.',
      );
      expect(request.facility.facilityCode).to.eq('983');
      expect(request.facility.parentSiteCode).to.eq('983');
      expect(request).to.have.property('typeOfCareId', 'CCPRMYRTNE');
      expect(request).to.have.property('optionTime1', 'AM');
      expect(request).to.have.property('optionTime2', 'No Time Selected');
      expect(request).to.have.property('optionTime3', 'No Time Selected');
      expect(request).to.have.property('email', 'veteran@gmail.com');
      expect(request).to.have.property('phoneNumber', '5035551234');
    });

    // Check messages requestBody is as expected
    cy.wait('@requestMessages').should(xhr => {
      const request = xhr.requestBody;
      expect(request).to.have.property(
        'messageText',
        'This is a very good reason.',
      );
    });

    // Your appointment request has been submitted step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/confirmation',
    );
    cy.axeCheckBestPractice();
    cy.get('va-alert').contains('We’re reviewing your request');
  });

  it('should submit form with provider chosen from list and submit request', () => {
    initCommunityCareMock();
    mockFeatureToggles();
    cy.visit(
      'health-care/schedule-view-va-appointments/appointments/new-appointment/',
    );
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

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    cy.findByText(/Choose a provider/i).click();

    cy.findByLabelText(/doe, jane/i).click();
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
    cy.wait('@appointmentRequests').should(xhr => {
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

      expect(xhr.status).to.eq(200);
      expect(xhr.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=cc',
      );
      const request = xhr.requestBody;
      expect(request)
        .to.have.property('optionDate1')
        .to.equal(date);
      expect(request)
        .to.have.property('optionDate2')
        .to.equal('No Date Selected');
      expect(request)
        .to.have.property('optionDate3')
        .to.equal('No Date Selected');
      expect(Cypress._.values(request.preferredProviders)).to.deep.eq([
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
      expect(request).to.have.property(
        'newMessage',
        'This is a very good reason.',
      );
      expect(request.facility.facilityCode).to.eq('983');
      expect(request.facility.parentSiteCode).to.eq('983');
      expect(request).to.have.property('typeOfCareId', 'CCPRMYRTNE');
      expect(request).to.have.property('optionTime1', 'AM');
      expect(request).to.have.property('optionTime2', 'No Time Selected');
      expect(request).to.have.property('optionTime3', 'No Time Selected');
      expect(request).to.have.property('email', 'veteran@gmail.com');
      expect(request).to.have.property('phoneNumber', '5035551234');
    });

    // Check messages requestBody is as expected
    cy.wait('@requestMessages').should(xhr => {
      const request = xhr.requestBody;
      expect(request).to.have.property(
        'messageText',
        'This is a very good reason.',
      );
    });

    // Your appointment request has been submitted step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/confirmation',
    );
    cy.axeCheckBestPractice();
    cy.get('va-alert').contains('We’re reviewing your request');
  });
});

describe('VAOS community care flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();
    mockFeatureToggles({
      v2Requests: true,
      homepageRefresh: true,
      v2Facilities: true,
    });
    cy.login(mockUser);
    cy.route({
      method: 'GET',
      url: /.*\/v0\/appointments?.*$/,
      response: { data: [] },
    });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click();
  });

  it('should submit request successfully', () => {
    const provider = {
      id: '1497723753',
      type: 'provider',
      attributes: {
        address: {
          street: '1012 14TH ST NW STE 700',
          city: 'WASHINGTON',
          state: 'DC',
          zip: '20005-3477',
        },
        caresitePhone: '202-638-0750',
        lat: 38.903195,
        long: -77.032382,
        name: 'Doe, Jane',
        phone: null,
        uniqueId: '1497723753',
      },
    };
    cy.route({
      method: 'GET',
      url: '/facilities_api/v1/ccp/provider?*',
      response: {
        data: [provider],
      },
    });
    cy.route({
      method: 'GET',
      url: '/v1/facilities/ccp/*',
      response: {
        data: provider,
      },
    });
    cy.route({
      method: 'GET',
      url: '/vaos/v2/facilities*',
      response: facilitiesV2,
    });
    cy.route({
      method: 'GET',
      url: '/vaos/v2/scheduling/configurations*',
      response: configurations,
    });
    cy.route({
      method: 'GET',
      url: '/vaos/v0/community_care/eligibility/PrimaryCare',
      response: {
        data: {
          id: 'PrimaryCare',
          type: 'cc_eligibility',
          attributes: { eligible: true },
        },
      },
    });
    cy.route({
      method: 'POST',
      url: '/vaos/v2/appointments',
      response: {
        data: {
          id: '25956',
          attributes: {},
        },
      },
    }).as('appointmentRequests');
    cy.route({
      method: 'GET',
      url: '/vaos/v2/appointments/25956',
      response: {
        data: requests.data.find(r => r.id === '25956'),
      },
    });
    cy.route({
      method: 'GET',
      url: '/v1/facilities/va/vha_442',
      response: facilityData.data.find(f => f.id === 'vha_442'),
    });
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

    // Tell us your community care preferences step
    cy.url().should(
      'contain',
      '/health-care/schedule-view-va-appointments/appointments/new-appointment/community-care-preferences',
    );
    cy.axeCheckBestPractice();
    // Select city
    cy.get('#root_communityCareSystemId_0').click();
    cy.get('#root_communityCareSystemId_0').should('be.checked');
    cy.findByText(/Choose a provider/i).click();

    cy.findByLabelText(/doe, jane/i).click();
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
    cy.wait('@appointmentRequests').should(xhr => {
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

      expect(xhr.status).to.eq(200);
      expect(xhr.url, 'post url').to.contain('/vaos/v2/appointments');
      const request = xhr.requestBody;
      expect(request.requestedPeriods[0].start).to.equal(date);
      expect(request.practitionerIds).to.deep.eq([
        {
          system: 'HSRM',
          value: '1497723753',
        },
      ]);

      expect(request.locationId).to.eq('983');
      expect(request).to.have.property('serviceType', 'primaryCare');
      expect(request).to.have.property('kind', 'cc');
      expect(request.contact.telecom[1].value).to.equal('veteran@gmail.com');
      expect(request.contact.telecom[0].value).to.equal('5035551234');
    });
    cy.url().should('include', '/requests/25956');
    cy.findByText('Preferred community care provider');
  });
});
