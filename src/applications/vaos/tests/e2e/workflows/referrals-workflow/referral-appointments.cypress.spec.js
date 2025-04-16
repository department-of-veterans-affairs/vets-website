/* eslint-disable camelcase */
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  mockReferralsGetApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockUser from '../../fixtures/MockUser';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import MockReferralListResponse from '../../fixtures/MockReferralListResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';

describe('VAOS Referral Appointments', () => {
  beforeEach(() => {
    // Set required feature flags
    mockFeatureToggles({
      vaOnlineSchedulingCCDirectScheduling: true,
      vaOnlineSchedulingFlatFacilityPage: true,
      vaOnlineSchedulingUseV2ApiRequests: true,
      vaOnlineSchedulingFeatureBreadcrumbUrlUpdate: true,
    });

    // Mock the appointments API
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

  describe('Viewing the Referrals and Requests page with referrals', () => {
    const numberOfReferrals = 2;
    beforeEach(() => {
      // Mock empty referrals response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });
    });

    it('should show a list of referrals', () => {
      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
      cy.injectAxeThenAxeCheck();

      // Verify that no referrals message is displayed
      referralsAndRequests.assertPendingReferrals({ count: numberOfReferrals });
    });
  });
});
