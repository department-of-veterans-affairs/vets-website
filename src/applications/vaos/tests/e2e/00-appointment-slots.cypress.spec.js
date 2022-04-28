import moment from 'moment';
import { vaosSetup } from './vaos-cypress-helpers';
import {
  // mockGetAppointmentSlots,
  mockAppointmentsApi,
  mockGetSchedulingConfiguration,
  mockFacilityApi,
  mockClinicApi,
  mockDirectScheduleSlots,
  mockLoginApi,
  mockEligibilityApi,
  mockFeatureToggleApi,
  mockCCPrimaryCareEligibility,
} from './vaos-cypress-routes';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';

describe('Direct schedule appointment slots', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ id: '983GC', apiVersion: 0 });
    mockAppointmentsApi({ id: '983GC', apiVersion: 2 });
    mockEligibilityApi();
    mockFacilityApi({ apiVersion: 2 });
    mockFeatureToggleApi();
    mockGetSchedulingConfiguration();
    mockLoginApi();
    mockCCPrimaryCareEligibility();
  });

  it('should display open slots for the correct date for mountain timezone conversions', () => {
    // NOTE: Same as choosePreferredDateTest test
    const today = moment()
      .add(1, 'month')
      .startOf('month')
      .add(4, 'days');

    const start = moment(today)
      // Set moment to 'utc' mode so formatting will contain 'Z' like api call
      .utc()
      // Add a couple of days since the expectation is the open slot should be
      // for the previous day when...
      .add(2, 'days')
      // the time is 12 am
      .startOf('day');
    const end = moment(start).utc();

    mockClinicApi({
      clinicId: '308',
      locations: ['983', '983GC'],
      apiVersion: 2,
    });
    mockDirectScheduleSlots({ clinicId: '308', start, end, apiVersion: 2 });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.wait('@mockUser');
    cy.injectAxeThenAxeCheck();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityTest(/Cheyenne VA Medical Center/);

    // Choose Clinic
    newApptTests.chooseClinicTest({ apiVersion: 2 });

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest(
      `${start.date() - 1}`,
      `${moment.tz(start, 'America/Denver').format('h:mm [p.m]')}`,
    );
  });

  it('should display open slots for the correct date for eastern timezone conversions', () => {
    const today = moment()
      .add(1, 'month')
      .startOf('month')
      .add(4, 'days');

    const start = moment(today)
      // Set moment to 'utc' mode so formatting will contain 'Z' like api call
      .utc()
      // Add a couple of days since the expectation is the open slot should be
      // for the next day when...
      .add(2, 'days')
      // the time is 00:00 am
      .startOf('day');
    const end = moment(start).utc();

    mockClinicApi({
      clinicId: '308',
      locations: ['984', '984GC'],
      apiVersion: 2,
    });
    mockDirectScheduleSlots({
      locationId: '984',
      clinicId: '308',
      start,
      end,
      apiVersion: 2,
    });

    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.wait('@mockUser');
    cy.injectAxeThenAxeCheck();

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityTest(/Dayton VA Medical Center/);

    // Choose Clinic
    newApptTests.chooseClinicTest({ apiVersion: 2 });

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
