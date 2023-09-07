import environment from 'platform/utilities/environment';
import moment from '../../../utils/business-days';
import {
  mockCCEligibilityApi,
  mockClinicApi,
  mockDirectScheduleSlotsApi,
  mockEligibilityApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockLoginApi,
  mockSchedulingConfigurationApi,
  mockAppointmentsApi,
  vaosSetup,
  mockFacilitiesApi,
  mockUserTransitionAvailabilities,
  mockAppointmentApi,
  mockGetEligibilityCC,
} from '../vaos-cypress-helpers';
import * as newApptTests from '../vaos-cypress-schedule-appointment-helpers';

const rootUrl = environment.isProduction()
  ? 'health-care/schedule-view-va-appointments/appointments/'
  : 'my-health/appointments/';
describe('VAOS direct schedule flow using VAOS service', () => {
  const start = moment()
    .addBusinessDay(5, 'days')
    // Adding number months to account for the test clicking the 'next' button to
    // advance to the next month.
    .add(1, 'months')
    .startOf('month')
    .day(9);
  const end = moment(start).add(60, 'minutes');

  beforeEach(() => {
    vaosSetup();

    const data = [
      {
        id: '1',
        type: 'Appointment',
        attributes: {
          clinic: '308',
          id: 1,
          kind: 'clinic',
          // location: {
          //   id: '983',
          //   name: 'Cheyenne VA Medical Center',
          // },
          locationId: '983',
          serviceType: 'optometry',
          start: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DDTHH:mm:ss'),
          status: 'booked',
        },
      },
    ];
    mockAppointmentsApi({ apiVersion: 0 });

    mockAppointmentsApi({ data, apiVersion: 2 });
    mockCCEligibilityApi();
    mockClinicApi({ locations: ['983'], apiVersion: 2 });
    mockDirectScheduleSlotsApi({
      clinicId: '455',
      start,
      end,
      apiVersion: 2,
    });
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFacilitiesApi({ apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
      acheron: true,
    });
    mockUserTransitionAvailabilities();
  });

  it('should submit form', () => {
    mockAppointmentApi({
      data: {
        id: 'mock1',
        type: 'Appointment',
        attributes: {
          id: 'mock1',
          kind: 'clinic',
          locationId: '983',
          serviceType: 'primaryCare',
          start,
          status: 'booked',
        },
      },
      id: 'mock1',
    });

    mockEligibilityApi({ isEligible: true });
    mockGetEligibilityCC();
    mockLoginApi();
    mockSchedulingConfigurationApi({ typeOfCareId: 'primaryCare' });

    cy.visit(rootUrl);
    cy.wait('@mockUser');
    cy.injectAxe();
    cy.axeCheckBestPractice();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Primary care');

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Flat Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
      apiVersion: 2,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'cough';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    // const fullReason = 'Follow-up/Routine: cough';
    cy.wait('@v2:create:appointment').should(xhr => {
      const request = xhr.request.body;

      expect(request.locationId).to.eq('983');
      expect(request.clinic).to.eq('455');
      expect(request.extension).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(request.status).to.eq('booked');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(null, false);
  });

  it('should submit form with an eye care type of care', () => {
    mockAppointmentApi({
      data: {
        id: 'mock1',
        type: 'Appointment',
        attributes: {
          id: 'mock1',
          kind: 'clinic',
          locationId: '983',
          serviceType: 'optometry',
          start,
          status: 'booked',
        },
      },
      id: 'mock1',
    });

    mockEligibilityApi({ typeOfCare: 'optometry', isEligible: true });
    mockGetEligibilityCC('Optometry');
    mockLoginApi();
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '984'],
      typeOfCareId: 'optometry',
      isDirect: true,
      isRequest: true,
    });

    cy.visit(rootUrl);
    cy.injectAxe();
    cy.axeCheckBestPractice();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Eye care');

    // Type of eye care
    cy.url().should('include', '/choose-eye-care');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Optometry/).click();
    cy.findByText(/Continue/).click();

    // Choose Facility Type
    newApptTests.chooseFacilityTypeTest(/VA medical center/);

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'insomnia';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    const fullReason = 'Follow-up/Routine: insomnia';
    cy.wait('@v2:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.locationId).to.eq('983');
      expect(body.clinic).to.eq('455');
      expect(body.extension).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      // expect(body.reasonCode.coding).to.include({ code: 'Routine Follow-up' });
      expect(body.reasonCode).to.have.property(
        'text',
        'reasonCode:ROUTINEVISIT|comments:insomnia',
      );
      expect(body.slot).to.have.property('id', '123');
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(fullReason, false);
  });

  it('should submit form with a sleep care type of care', () => {
    mockAppointmentApi({
      data: {
        id: 'mock1',
        type: 'Appointment',
        attributes: {
          id: 'mock1',
          kind: 'clinic',
          locationId: '983',
          serviceType: 'homeSleepTesting',
          start,
          status: 'booked',
        },
      },
      id: 'mock1',
    });

    mockEligibilityApi({ typeOfCare: 'homeSleepTesting', isEligible: true });
    mockGetEligibilityCC('homeSleepTesting');
    mockLoginApi();
    mockSchedulingConfigurationApi({
      facilityIds: ['983', '984'],
      typeOfCareId: 'homeSleepTesting',
      isDirect: true,
      isRequest: true,
    });

    cy.visit(rootUrl);
    cy.injectAxe();

    // Start flow
    cy.findByText('Start scheduling').click({ waitForAnimations: true });

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Sleep medicine');

    // Type of sleep care
    cy.url().should('include', '/choose-sleep-care');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Sleep medicine/).click();
    cy.findByText(/Continue/).click();

    // Choose VA Facility
    newApptTests.chooseVAFacilityV2Test({
      label: /Cheyenne VA Medical Center/,
    });

    // Choose Clinic
    newApptTests.chooseClinicTest();

    // Choose preferred date
    newApptTests.choosePreferredDateTest();

    // Select time slot
    newApptTests.selectTimeSlotTest();

    // Reason for appointment
    const additionalInfo = 'insomnia';
    newApptTests.reasonForAppointmentTest(additionalInfo);

    // Contact info
    newApptTests.contactInfoDirectScheduleTest();

    // Review
    newApptTests.reviewTest();

    // Check form requestBody is as expected
    const fullReason = 'Follow-up/Routine: insomnia';
    cy.wait('@v2:create:appointment').should(xhr => {
      const { body } = xhr.request;

      expect(body.locationId).to.eq('983');
      expect(body.clinic).to.eq('455');
      expect(body.extension).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body.reasonCode).to.have.property(
        'text',
        'reasonCode:ROUTINEVISIT|comments:insomnia',
      );
    });

    // Confirmation page
    newApptTests.confirmationPageV2Test(fullReason, false);
  });
});
