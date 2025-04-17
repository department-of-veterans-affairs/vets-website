/* eslint-disable camelcase */
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  mockReferralsGetApi,
  mockReferralDetailGetApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockUser from '../../fixtures/MockUser';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import MockReferralListResponse from '../../fixtures/MockReferralListResponse';
import MockReferralDetailResponse from '../../fixtures/MockReferralDetailResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';
import scheduleReferral from '../../referrals/page-objects/ScheduleReferral';

describe('VAOS Referral Appointments', () => {
  beforeEach(() => {
    // Set required feature flags
    mockFeatureToggles({
      vaOnlineSchedulingCCDirectScheduling: true,
      vaOnlineSchedulingFlatFacilityPage: true,
      vaOnlineSchedulingUseV2ApiRequests: true,
      vaOnlineSchedulingFeatureBreadcrumbUrlUpdate: true,
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

    beforeEach(() => {
      // Mock referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });
      const referralId = referralsResponse.data[0].id;

      // Mock referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        id: referralId,
        hasAppointments: false,
      });
      mockReferralDetailGetApi({
        id: referralId,
        response: referralDetailResponse,
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
      scheduleReferral.assertReferringFacilityInfo();

      // Click the schedule appointment button
      scheduleReferral.clickScheduleAppointment();
    });
  });
});
