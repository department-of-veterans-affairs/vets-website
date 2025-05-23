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
  mockAppointmentDetailsApi,
  mockSubmitAppointmentApi,
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

      // Verify that no referrals message is displayed
      referralsAndRequests.assertPendingReferrals({ count: 0 });
    });
  });

  describe('Creating an appointment from a referral', () => {
    const numberOfReferrals = 2;
    const appointmentId = 'EEKoGzEf';

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

      // Mock appointment details response
      const appointmentDetailsResponse = new MockReferralAppointmentDetailsResponse(
        {
          appointmentId,
          typeOfCare: 'OPTOMETRY',
          providerName: 'Dr. Bones',
          organizationName: 'Meridian Health',
          success: true,
        },
      ).toJSON();
      mockAppointmentDetailsApi({
        id: appointmentId,
        response: appointmentDetailsResponse,
      });
    });

    it('should navigate through the referral scheduling flow', () => {
      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
      cy.injectAxeThenAxeCheck();

      // Verify that referrals are displayed
      referralsAndRequests.assertPendingReferrals({ count: numberOfReferrals });

      // Select the referral
      referralsAndRequests.selectReferral(0);

      // Wait for referral detail to load
      cy.wait('@v2:get:referral:detail');
      cy.injectAxeThenAxeCheck();

      // Validate we've reached the Schedule Referral page
      scheduleReferral.validate();
      scheduleReferral.assertReferralDetails();
      scheduleReferral.assertreferringFacility();

      // Click the schedule appointment button
      scheduleReferral.clickScheduleAppointment();

      // Wait for draft referral appointment to load
      cy.wait('@v2:post:draftReferralAppointment');
      cy.injectAxeThenAxeCheck();

      // Validate we've reached the choose date and time page
      chooseDateAndTime.validate();
      chooseDateAndTime.assertProviderInfo();
      chooseDateAndTime.selectNextMonth();
      chooseDateAndTime.assertAppointmentSlots(3);

      // Select the first appointment slot
      chooseDateAndTime.selectAppointmentSlot(0);

      // Click continue to proceed with scheduling
      chooseDateAndTime.clickContinue();
      cy.injectAxeThenAxeCheck();

      // Validate we've reached the review and confirm page
      reviewAndConfirm.validate();
      reviewAndConfirm.assertProviderInfo();
      reviewAndConfirm.assertDateTimeInfo();

      // Click the continue button to finalize the appointment
      reviewAndConfirm.clickContinue();

      // Wait for submit appointment response
      cy.wait('@v2:post:submitAppointment');

      // Wait for appointment details to load
      cy.wait('@v2:get:appointmentDetails');
      cy.injectAxeThenAxeCheck();

      // Verify we're redirected to the confirmation page
      completeReferral.validate();
      completeReferral.assertAppointmentDetails();
      completeReferral.assertProviderInfo();
      completeReferral.assertReferralsLink();

      // Click the details link
      completeReferral.clickDetailsLink();

      // Verify the completed appointment details
      cy.injectAxeThenAxeCheck();
      epsAppointmentDetails.validate();
      epsAppointmentDetails.assertProviderInfo();
    });
  });
});
