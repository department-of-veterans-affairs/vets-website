import moment from 'moment/moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import {
  vaosSetup,
  mockFeatureToggles,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockLoginApi,
  mockCCEligibilityApi,
  mockSchedulingConfigurationApi,
  mockUserTransitionAvailabilities,
  mockEligibilityApi,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';
import { mockVamcEhr } from './vaos-cypress-v2-helpers';

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
  if (facilitySelection) {
    cy.wait(['@v2:get:facilities']);
    facilitySelection();
  }
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
  cy.wait('@v2:create:appointment').should(xhr => {
    expect(xhr.response.statusCode).to.eq(200);
    expect(xhr.request.url, 'post url').to.contain('/vaos/v2/appointments');
    const { body } = xhr.request;
    // cy.assertRequestedPeriod(body.optionDate1);
    // expect(body)
    //   .to.have.property('optionDate2')
    //   .to.equal('No Date Selected');
    // expect(body)
    //   .to.have.property('optionDate3')
    //   .to.equal('No Date Selected');

    expect(body.locationId).to.eq('983GB');
    expect(body).to.have.property('serviceType', 'socialWork');
    // expect(body.preferredTimesForPhoneCall).to.include(['Morning']);
  });

  // Confirmation page
  cy.url().should('include', '/requests/mock1');
  cy.findByText('VA appointment');
  cy.findByText(/your appointment request has been submitted/i);
  cy.axeCheckBestPractice();
}

describe('VAOS VA request flow using VAOS service', () => {
  beforeEach(() => {
    vaosSetup();

    // mockAppointmentsApi({ apiVersion: 0 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983HK'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({ clinicId: '455', apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockUserTransitionAvailabilities();
  });

  it('submit request successfully', () => {
    const appointments = [
      {
        id: '1',
        type: 'appointment',
        attributes: {
          clinic: '308',
          end: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          id: '1',
          locationId: '442HK',
          serviceType: 'socialWork',
          start: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          status: 'booked',
        },
      },
    ];
    const facilities = [
      {
        id: '983',
        type: 'facilities',
        attributes: {
          id: '983',
          vistaSite: '983',
          vastParent: '983',
          name: 'Cheyenne VA Medical Center',
          classification: 'VA Medical Center (VAMC)',
          physicalAddress: {
            line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      {
        id: '983HK',
        type: 'facilities',
        attributes: {
          id: '983HK',
          vistaSite: '983',
          name: 'Wheatland VA Mobile Clinic',
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
    ];

    mockAppointmentsApi({ data: appointments, apiVersion: 2 });
    mockFacilitiesApi({ data: facilities, apiVersion: 2 });

    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    mockLoginApi();
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '983HK'],
      typeOfCareId: 'socialWork',
      isDirect: false,
      isRequest: true,
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
    cy.wait(['@v2:get:facilities', '@scheduling-configurations']);
    // cy.waitUntil(() => {
    //   return cy.get('[data-testid="facilitiesSelect"]').should('be.visible');
    // });
    cy.findByLabelText(/Wheatland VA Mobile Clinic/)
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
    cy.wait('@v2:create:appointment').should(xhr => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.url, 'post url').to.contain('/vaos/v2/appointments');
      const { body } = xhr.request;
      cy.assertRequestedPeriod(body.requestedPeriods[0].start);

      expect(body.locationId).to.eq('983HK');
      expect(body).to.have.property('serviceType', 'socialWork');
      expect(body).to.have.property('kind', 'clinic');
      expect(body.contact.telecom[1].value).to.equal('veteran@gmail.com');
      expect(body.contact.telecom[0].value).to.equal('5035551234');
    });
    cy.url().should('include', '/requests/mock1');
    cy.findByText('VA appointment');
    cy.findByText(/your appointment request has been submitted/i);
  });

  it('should submit form successfully for a single system user', () => {
    const appointments = [
      {
        id: '1',
        type: 'appointment',
        attributes: {
          clinic: '308',
          end: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          id: '1',
          locationId: '983',
          serviceType: 'socialWork',
          start: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          status: 'booked',
        },
      },
    ];
    const facilities = [
      {
        id: '983',
        type: 'facilities',
        attributes: {
          id: '983',
          vistaSite: '983',
          vastParent: '983',
          name: 'Cheyenne VA Medical Center',
          classification: 'VA Medical Center (VAMC)',
          physicalAddress: {
            line: ['2360 East Pershing Boulevard', null, 'Suite 10'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      {
        id: '983GB',
        type: 'facilities',
        attributes: {
          id: '983GB',
          vistaSite: '983',
          name: 'Sidney VA Clinic',
          physicalAddress: {
            line: ['1116 10th Avenue'],
            city: 'Sidney',
            state: 'NE',
            postalCode: '69162-2001',
          },
        },
      },
    ];

    mockAppointmentsApi({ data: appointments, apiVersion: 2 });
    mockFacilitiesApi({ data: facilities, apiVersion: 2 });

    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    mockLoginApi();
    mockSchedulingConfigurationApi({
      facilityIds: ['983GB'],
      typeOfCareId: 'socialWork',
      isDirect: false,
      isRequest: true,
    });

    fillOutForm();

    cy.axeCheckBestPractice();
  });

  it('should display Cerner how to schedule page if a Cerner facility is chosen', () => {
    const appointments = [
      {
        id: '1',
        type: 'appointment',
        attributes: {
          clinic: '308',
          end: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          id: '1',
          locationId: '983GB',
          serviceType: 'socialWork',
          start: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          status: 'booked',
        },
      },
    ];

    mockAppointmentsApi({ data: appointments, apiVersion: 2 });
    mockEligibilityApi({ typeOfCare: 'socialWork', isEligible: true });
    mockLoginApi({ facilityId: '983' });
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '984'],
      typeOfCareId: 'socialWork',
      isDirect: true,
      isRequest: true,
    });
    mockVamcEhr({ isCerner: true });
    const data = [
      {
        id: '983',
        type: 'facilities',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      {
        id: '984',
        type: 'facilities',
        attributes: {
          id: '984',
          vistaSite: '984',
          name: 'Dayton VA Medical Center',
          physicalAddress: {
            line: ['4100 West Third Street'],
            city: 'Dayton',
            state: 'OH',
            postalCode: '45428-9000',
          },
        },
      },
    ];

    mockFacilitiesApi({ data, apiVersion: 2 });
    mockClinicApi({ locations: ['983'], apiVersion: 2 });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
    cy.wait('@drupal-source-of-truth');

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility-2', { timeout: Timeouts.slow });
    cy.axeCheckBestPractice();
    cy.wait(['@v2:get:facilities', '@scheduling-configurations']);
    cy.findByLabelText(/Cheyenne VA Medical Center/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    cy.url().should('include', '/how-to-schedule');
    cy.findByText(/Cheyenne VA Medical Center/i);
    cy.findByText(/To schedule an appointment online at this facility/);
    cy.axeCheckBestPractice();
  });
});
