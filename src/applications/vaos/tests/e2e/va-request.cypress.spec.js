import moment from 'moment';
import {
  initAppointmentListMock,
  initVARequestMock,
  vaosSetup,
  mockUser,
  mockFeatureToggles,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';
import facilities from '../../services/mocks/var/facilities.json';
import facilities983 from '../../services/mocks/var/facilities_983.json';
import facilityData from '../../services/mocks/var/facility_data.json';
import requestEligibilityCriteria from '../../services/mocks/var/request_eligibility_criteria.json';
import directEligibilityCriteria from '../../services/mocks/var/direct_booking_eligibility_criteria.json';
import requests from '../../services/mocks/v2/requests.json';

// skipped due to failures with date validation
describe.skip('VAOS VA request flow', () => {
  function fillOutForm(facilitySelection) {
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility');
    cy.axeCheckBestPractice();
    if (facilitySelection) facilitySelection();
    cy.findByText(/Continue/).click();

    // Choose date and slot (AM or PM)
    newApptTests.selectRequestSlotTest();

    // Reason for appointment
    newApptTests.reasonForAppointmentTest(
      'cough',
      /Please provide any additional details/,
    );

    // Visit type
    newApptTests.howToBeSeenTest();

    // Contact info
    newApptTests.contactInfoTest();

    // Review
    cy.url().should('include', '/review');
    cy.axeCheckBestPractice();
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@appointmentRequests').should(xhr => {
      // Add check to see if adding 7 days will result in the next month. If so,
      // add 2 months (the test clicks the calendar next button to advance to the
      // next month) and set date to beginning of month, else set the date to the
      // beginning of the next month
      const date = moment();
      if (
        moment(date)
          .add(7, 'days')
          .isSame(moment(date).add(1, 'month'), 'month')
      ) {
        date.add(2, 'months').startOf('month');
      } else {
        date.add(1, 'months').startOf('month');
      }

      expect(xhr.status).to.eq(200);
      expect(xhr.url, 'post url').to.contain(
        '/vaos/v0/appointment_requests?type=va',
      );
      const request = xhr.requestBody;
      expect(request)
        .to.have.property('optionDate1')
        .to.equal(date.format('MM/DD/YYYY'));
      expect(request)
        .to.have.property('optionDate2')
        .to.equal('No Date Selected');
      expect(request)
        .to.have.property('optionDate3')
        .to.equal('No Date Selected');

      expect(request.facility.facilityCode).to.eq('983GB');
      expect(request.facility.parentSiteCode).to.eq('983');
      expect(request).to.have.property('typeOfCareId', '125');
      expect(request).to.have.property('visitType', 'Office Visit');
      expect(request).to.have.property('optionTime1', 'AM');
      expect(request).to.have.property('optionTime2', 'No Time Selected');
      expect(request).to.have.property('optionTime3', 'No Time Selected');
      expect(request).to.have.property('email', 'veteran@gmail.com');
      expect(request).to.have.property('phoneNumber', '5035551234');
    });

    // Check messages requestBody is as expected
    cy.wait('@requestMessages').should(xhr => {
      const request = xhr.requestBody;
      expect(request).to.have.property('messageText', 'cough');
    });

    // Confirmation page
    cy.url().should('include', '/requests/testing');
    cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
    cy.axeCheckBestPractice();
  }

  it('should submit form successfully for a multi system user', () => {
    initAppointmentListMock();
    initVARequestMock();
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });
  });
  it('should submit form successfully for a single system user', () => {
    initAppointmentListMock();
    initVARequestMock();
    cy.route({
      method: 'GET',
      url: '/vaos/v0/facilities**',
      response: {
        data: facilities.data.slice(0, 1),
      },
    });
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });
  });

  it('should display Cerner how to schedule page if a Cerner facility is chosen', () => {
    initAppointmentListMock();
    initVARequestMock({ cernerFacility: '983' });
    cy.route({
      method: 'GET',
      url: '/vaos/v0/facilities**',
      response: {
        data: facilities.data.slice(0, 1),
      },
    });
    cy.route({
      method: 'GET',
      url: '/vaos/v0/systems/983/direct_scheduling_facilities*',
      response: {
        data: facilities983.data.filter(f => f.id === '983GB'),
      },
    });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility-2');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Rawlins/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    cy.url().should('include', '/how-to-schedule');
    cy.findByText(/Rawlins VA Clinic/);
    cy.findByText(/To schedule an appointment online at this facility/);
    cy.axeCheckBestPractice();
  });
});

describe('VAOS VA request flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();
    mockFeatureToggles({
      v2Requests: true,
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
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
  });

  it('should submit request successfully', () => {
    cy.route({
      method: 'GET',
      url: '/vaos/v0/request_eligibility_criteria*',
      response: requestEligibilityCriteria,
    });
    cy.route({
      method: 'GET',
      url: '/vaos/v0/direct_booking_eligibility_criteria*',
      response: directEligibilityCriteria,
    });
    cy.route({
      method: 'GET',
      url: '/v1/facilities/va?ids=*',
      response: facilityData,
    });
    cy.route({
      method: 'GET',
      url: '/v1/facilities/va/vha_442GC',
      response: facilityData.data.find(f => f.id === 'vha_442GC'),
    });
    cy.route({
      method: 'GET',
      url: `/vaos/v0/facilities/limits*`,
      response: {
        data: [
          {
            id: '983GB',
            attributes: {
              requestLimit: 1,
              numberOfRequests: 0,
            },
          },
        ],
      },
    });
    cy.route({
      method: 'GET',
      url: `/vaos/v0/facilities/983GB/visits/*`,
      response: {
        data: {
          id: '05084676-77a1-4754-b4e7-3638cb3124e5',
          type: 'facility_visit',
          attributes: {
            durationInMonths: 24,
            hasVisitedInPastMonths: true,
          },
        },
      },
    });
    cy.route({
      method: 'POST',
      url: '/vaos/v2/appointments',
      response: {
        data: {
          id: '25957',
          attributes: {
            reasonCode: {},
          },
        },
      },
    }).as('appointmentRequests');
    cy.route({
      method: 'GET',
      url: '/vaos/v2/appointments/25957*',
      response: {
        data: requests.data.find(r => r.id === '25957'),
      },
    });
    cy.route({
      method: 'GET',
      url: '/v1/facilities/va/vha_442',
      response: facilityData.data.find(f => f.id === 'vha_442'),
    });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Sidney/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    // Choose date and slot (AM or PM)
    newApptTests.selectRequestSlotTest();

    // Reason for appointment
    newApptTests.reasonForAppointmentTest(
      'cough',
      /Please provide any additional details/,
    );

    // Visit type
    newApptTests.howToBeSeenTest();

    // Contact info
    newApptTests.contactInfoTest();

    // Review
    cy.url().should('include', '/review');
    cy.axeCheckBestPractice();
    cy.findByText('Request appointment').click();

    // Check form requestBody is as expected
    cy.wait('@appointmentRequests').should(xhr => {
      // Add check to see if adding 7 days will result in the next month. If so,
      // add 2 months (the test clicks the calendar next button to advance to the
      // next month) and set date to beginning of month, else set the date to the
      // beginning of the next month
      const date = moment();
      if (
        moment(date)
          .add(7, 'days')
          .isSame(moment(date).add(1, 'month'), 'month')
      ) {
        date.add(2, 'months').startOf('month');
      } else {
        date.add(1, 'months').startOf('month');
      }

      expect(xhr.status).to.eq(200);
      expect(xhr.url, 'post url').to.contain('/vaos/v2/appointments');
      const request = xhr.requestBody;
      expect(request.requestedPeriods[0].start).to.equal(
        moment.utc(date.format('YYYY-MM-DDTHH:mm:ss')).format(),
      );

      expect(request.locationId).to.eq('983GB');
      expect(request).to.have.property('serviceType', 'socialWork');
      expect(request).to.have.property('kind', 'clinic');
      expect(request.contact.telecom[1].value).to.equal('veteran@gmail.com');
      expect(request.contact.telecom[0].value).to.equal('5035551234');
    });
    cy.url().should('include', '/requests/25957');
    cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
  });
});
