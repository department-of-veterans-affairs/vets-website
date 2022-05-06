import moment from 'moment';
import {
  mockUser,
  setupPlatform,
  setupVaos,
  mockGetAppointmentSlots,
  mockGetAppointments,
  mockGetSchedulingConfiguration,
  mockGetFacilities,
  mockGetEligibilityCC,
  mockGetEligibility,
  mockGetClinics,
} from './vaos-cypress-v2-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-v2-helpers';

describe.skip('Direct schedule appointment slots', () => {
  beforeEach(() => {
    setupPlatform();
    setupVaos();

    mockGetAppointments();
    mockGetAppointments({ version: 2 });
    mockGetSchedulingConfiguration();
    mockGetFacilities();
    mockGetEligibilityCC();
    mockGetEligibility();
    mockGetClinics(['983', '984']);

    cy.login(mockUser);
  });

  it('should display open slots for the correct date for mountain timezone conversions', () => {
    const today = moment();
    const start = moment(today)
      // Set moment to 'utc' mode so formatting will contain 'Z' like api call
      .utc()
      // Add a couple of days since the expectation is the open slot should be
      // for the previous day when...
      .add(2, 'days')
      // the time is 12 am
      .startOf('day');
    const end = moment(start).utc();

    mockGetAppointmentSlots({
      start: start.format(),
      end: end.format(),
    });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.wait(['@appointments-V2']);

    cy.get('h1')
      .should('be.visible')
      .and('contain', 'Your appointments');

    // Start flow
    cy.injectAxeThenAxeCheck();
    cy.injectAxe();

    cy.findByText('Start scheduling');
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityTest();

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest(
      `${start.date() - 1}`,
      `${moment.tz(start, 'America/Denver').format('h:mm [p.m]')}`,
    );
  });

  it('should display open slots for the correct date for eastern timezone conversions', () => {
    const today = moment();
    const start = moment(today)
      // Set moment to 'utc' mode so formatting will contain 'Z' like api call
      .utc()
      // Add a couple of days since the expectation is the open slot should be
      // for the next day when...
      .add(2, 'days')
      // the time is 00:00 am
      .startOf('day');
    const end = moment(start).utc();

    mockGetAppointmentSlots({
      locationId: '984',
      start: start.format(),
      end: end.format(),
    });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.wait(['@appointments-V2']);

    cy.get('h1')
      .should('be.visible')
      .and('contain', 'Your appointments');

    // Start flow
    cy.injectAxeThenAxeCheck();
    cy.injectAxe();

    cy.findByText('Start scheduling');
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityTest('984');

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    cy.log(start.date());
    newApptTests.selectTimeSlotTest(
      `${start.date() - 1}`,
      `${moment.tz(start, 'America/New_York').format('h:mm [p.m]')}`,
    );
  });
});
