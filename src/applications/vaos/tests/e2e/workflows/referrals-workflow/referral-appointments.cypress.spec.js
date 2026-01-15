import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import {
  mockReferralsGetApi,
  mockReferralDetailGetApi,
  mockDraftReferralAppointmentApi,
  mockAppointmentDetailsApiWithPolling,
  mockSubmitAppointmentApi,
  saveScreenshot,
} from './referrals-cypress-helpers';
import MockUser from '../../../fixtures/MockUser';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockReferralListResponse from '../../../fixtures/MockReferralListResponse';
import MockReferralDetailResponse from '../../../fixtures/MockReferralDetailResponse';
import MockReferralDraftAppointmentResponse from '../../../fixtures/MockReferralDraftAppointmentResponse';
import MockReferralAppointmentDetailsResponse from '../../../fixtures/MockReferralAppointmentDetailsResponse';
import MockReferralSubmitAppointmentResponse from '../../../fixtures/MockReferralSubmitAppointmentResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';
import scheduleReferral from '../../referrals/page-objects/ScheduleReferral';
import chooseDateAndTime from '../../referrals/page-objects/ChooseDateAndTime';
import reviewAndConfirm from '../../referrals/page-objects/ReviewAndConfirm';
import completeReferral from '../../referrals/page-objects/CompleteReferral';
import epsAppointmentDetails from '../../referrals/page-objects/EpsAppointmentDetails';
import { mockToday } from '../../../mocks/constants';

describe('VAOS Referral Appointments', () => {
  beforeEach(() => {
    // Set required feature flags
    mockFeatureToggles({
      vaOnlineSchedulingCCDirectScheduling: true,
      vaOnlineSchedulingFlatFacilityPage: true,
      vaOnlineSchedulingUseV2ApiRequests: true,
    });

    // Mock the appointments API to at least have one appointment
    const response = new MockAppointmentResponse({
      cancellable: false,
      localStartTime: Date(),
      status: APPOINTMENT_STATUS.booked,
    });
    mockAppointmentsGetApi({ response: [response] });

    // Setup VAOS app
    vaosSetup();
    mockVamcEhrApi();
    cy.login(new MockUser());

    // Visit the appointments page
    cy.visit('/my-health/appointments');
  });

  describe('Viewing the Referrals and Requests page with no referrals', () => {
    beforeEach(() => {
      // Mock empty referrals response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 0,
      });
      mockReferralsGetApi({ response: referralsResponse });
    });

    it('should show no referrals message', () => {
      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
      cy.injectAxeThenAxeCheck();
      saveScreenshot(
        'vaos_ccDirectScheduling_referralsAndRequests_noReferrals',
      );

      // Verify that no referrals message is displayed
      referralsAndRequests.assertPendingReferrals({ count: 0 });
    });
  });

  describe('Creating an appointment from a referral', () => {
    const numberOfReferrals = 2;
    const appointmentId = 'appointment-for-VA9672';

    beforeEach(() => {
      // Mock referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });
      const referralId = referralsResponse.data[0].id;
      const { referralNumber } = referralsResponse.data[0].attributes;

      // Mock referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        id: referralId,
        hasAppointments: false,
      });
      mockReferralDetailGetApi({
        id: referralId,
        response: referralDetailResponse,
      });

      // Mock draft referral appointment response
      const draftReferralAppointment = new MockReferralDraftAppointmentResponse(
        {
          referralNumber,
          categoryOfCare: 'Physical Therapy',
          numberOfSlots: 3,
          currentDate: mockToday,
        },
      );
      mockDraftReferralAppointmentApi({
        response: draftReferralAppointment,
      });

      // Mock submit appointment response
      const submitAppointmentResponse = new MockReferralSubmitAppointmentResponse(
        {
          appointmentId,
          success: true,
        },
      ).toJSON();
      mockSubmitAppointmentApi({
        response: submitAppointmentResponse,
      });

      // Mock appointment details with polling - first 5 requests return proposed, then booked
      const proposedAppointmentResponse = new MockReferralAppointmentDetailsResponse(
        {
          appointmentId,
          typeOfCare: 'OPTOMETRY',
          providerName: 'Dr. Bones',
          organizationName: 'Meridian Health',
          status: 'proposed',
          success: true,
        },
      ).toJSON();

      const bookedAppointmentResponse = new MockReferralAppointmentDetailsResponse(
        {
          appointmentId,
          typeOfCare: 'OPTOMETRY',
          providerName: 'Dr. Bones',
          organizationName: 'Meridian Health',
          status: 'booked',
          success: true,
        },
      ).toJSON();

      mockAppointmentDetailsApiWithPolling({
        id: '*',
        firstResponse: proposedAppointmentResponse,
        secondResponse: bookedAppointmentResponse,
        switchAfterRequests: 2,
      });
    });

    it('should navigate through the referral scheduling flow', () => {
      // Use cy.clock() to control time and ensure consistent appointment slot dates
      cy.clock(mockToday, ['Date']);

      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
      cy.injectAxeThenAxeCheck();
      saveScreenshot(
        'vaos_ccDirectScheduling_referralsAndRequests_withReferrals',
      );

      // Verify that referrals are displayed
      referralsAndRequests.assertPendingReferrals({ count: numberOfReferrals });

      // Select the referral
      referralsAndRequests.selectReferral(0);

      // Wait for referral detail to load
      cy.wait('@v2:get:referral:detail');
      cy.injectAxeThenAxeCheck();
      saveScreenshot('vaos_ccDirectScheduling_referralDetails');

      // Validate we've reached the Schedule Referral page
      scheduleReferral.validate();
      scheduleReferral.assertReferralDetails();
      scheduleReferral.assertCommunityCareOfficeLink();

      // Click the schedule appointment button
      scheduleReferral.clickScheduleAppointment();

      // Wait for draft referral appointment to load
      cy.wait('@v2:post:draftReferralAppointment');
      cy.injectAxeThenAxeCheck();
      saveScreenshot('vaos_ccDirectScheduling_selectingSlotTimes_noSelection');

      // Validate we've reached the choose date and time page
      chooseDateAndTime.validate();
      chooseDateAndTime.assertProviderInfo();
      chooseDateAndTime.selectNextMonth();
      chooseDateAndTime.assertAppointmentSlots(23);

      // Select the first appointment slot
      chooseDateAndTime.selectAppointmentSlot(0);
      saveScreenshot('vaos_ccDirectScheduling_selectingSlotTimes_selectedSlot');

      // Click continue to proceed with scheduling
      chooseDateAndTime.clickContinue();
      cy.injectAxeThenAxeCheck();
      saveScreenshot('vaos_ccDirectScheduling_reviewAndConfirm');

      // Validate we've reached the review and confirm page
      reviewAndConfirm.validate();
      reviewAndConfirm.assertProviderInfo();
      reviewAndConfirm.assertDateTimeInfo();

      // Click the continue button to finalize the appointment
      reviewAndConfirm.clickContinue();

      // Wait for submit appointment response
      cy.wait('@v2:post:submitAppointment');

      // Wait for first appointment details polling request (should be proposed)
      cy.wait('@v2:get:appointmentDetails:polling');
      cy.injectAxeThenAxeCheck();
      saveScreenshot('vaos_ccDirectScheduling_appointmentSubmit_loading');

      // Wait for additional polling requests to eventually get booked status
      // The app should poll multiple times, then it will get a booked status
      cy.wait('@v2:get:appointmentDetails:polling', { timeout: 10000 });
      cy.wait('@v2:get:appointmentDetails:polling', { timeout: 10000 }); // should return booked

      // Verify we're redirected to the confirmation page
      completeReferral.validate();
      saveScreenshot('vaos_ccDirectScheduling_appointmentSubmit_complete');
      completeReferral.assertAppointmentDetails();
      completeReferral.assertProviderInfo();
      completeReferral.assertReferralsLink();
      completeReferral.clickDetailsLink();

      // Verify the completed appointment details
      cy.injectAxeThenAxeCheck();
      epsAppointmentDetails.validate();
      saveScreenshot('vaos_ccDirectScheduling_appointmentDetails');
      epsAppointmentDetails.assertProviderInfo();
    });
  });

  describe('Referral with no slots available', () => {
    beforeEach(() => {
      // Mock referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 1,
      }).toJSON();
      const referralId = referralsResponse.data[0].id;
      const { referralNumber } = referralsResponse.data[0].attributes;

      mockReferralsGetApi({ response: referralsResponse });

      // Mock referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        id: referralId,
        hasAppointments: false,
      });
      mockReferralDetailGetApi({
        id: referralId,
        response: referralDetailResponse,
      });
      // Mock draft referral appointment response
      const draftReferralAppointment = new MockReferralDraftAppointmentResponse(
        {
          referralNumber,
          categoryOfCare: 'Optometry',
          noSlotsError: true,
          currentDate: mockToday,
        },
      );
      mockDraftReferralAppointmentApi({
        response: draftReferralAppointment,
      });
    });

    it('should show no slots available message', () => {
      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Select the referral
      referralsAndRequests.selectReferral(0);

      // Wait for referral detail to load
      cy.wait('@v2:get:referral:detail');

      // Click the schedule appointment button
      scheduleReferral.clickScheduleAppointment();

      // Wait for draft referral appointment to load
      cy.wait('@v2:post:draftReferralAppointment');
      cy.injectAxeThenAxeCheck();

      // Verify no slots available message is displayed
      chooseDateAndTime.assertNoSlotsAvailableAlert();

      // Verify the calendar is not displayed
      cy.findByTestId('cal-widget').should('not.exist');
      saveScreenshot(
        'vaos_ccDirectScheduling_selectingSlotTimes_noSlotsAvailableError',
      );
    });
  });

  describe('Referral without provider information', () => {
    beforeEach(() => {
      // Mock referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 1,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });
      const referralId = referralsResponse.data[0].id;

      // Mock referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        id: referralId,
        hasAppointments: false,
        provider: null,
      });
      mockReferralDetailGetApi({
        id: referralId,
        response: referralDetailResponse,
      });
    });

    it('should show online scheduling not available message', () => {
      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Select the referral without provider information
      referralsAndRequests.selectReferral(0);

      // Wait for referral detail to load
      cy.wait('@v2:get:referral:detail');
      cy.injectAxeThenAxeCheck();

      // Verify online scheduling not available message is displayed
      scheduleReferral.assertOnlineSchedulingNotAvailableAlert();
      saveScreenshot('vaos_ccDirectScheduling_referralDetail_noProviderError');
    });
  });

  describe('Referral not from pilot station', () => {
    const referralId = 'out-of-pilot-station';
    const stationId = '12345'; // out of pilot station id
    beforeEach(() => {
      // Mock successful referrals list response
      // Create referrals using the fixture
      const outOfPilotStationReferral = MockReferralListResponse.createReferral(
        {
          id: referralId,
          categoryOfCare: 'OPTOMETRY',
          stationId,
        },
      );
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 0,
      }).toJSON();
      // append the out of pilot station referral to the referrals response
      referralsResponse.data.push(outOfPilotStationReferral);
      mockReferralsGetApi({ response: referralsResponse });

      // Mock referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        id: referralId,
        hasAppointments: false,
        stationId,
      });
      mockReferralDetailGetApi({
        id: referralId,
        response: referralDetailResponse,
      });
    });

    it('should allow the use to see refferal details selecting the referral from the referrals and requests page', () => {
      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
      cy.injectAxeThenAxeCheck();

      // Verify that referrals are displayed
      referralsAndRequests.assertPendingReferrals({ count: 1 });

      // Select the referral
      referralsAndRequests.selectReferral(0);

      // Wait for referral detail to load
      cy.wait('@v2:get:referral:detail');
      cy.injectAxeThenAxeCheck();

      // Validate we've reached the Schedule Referral page
      scheduleReferral.validate();
      scheduleReferral.assertReferralDetails();
      scheduleReferral.assertOnlineSchedulingNotAvailableAlert();
      saveScreenshot(
        'vaos_ccDirectScheduling_referralDetail_outOfPilotStationError',
      );
    });
  });
});
