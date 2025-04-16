/* eslint-disable camelcase */
import {
  mockFeatureToggles,
  mockAppointmentsGetApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';
import { MockAppointmentResponse } from '../../fixtures/MockAppointmentResponse';

describe('VAOS Referral Appointments', () => {
  describe('Navigating to Referrals and Requests', () => {
    beforeEach(() => {
      // Set required feature flags
      mockFeatureToggles({
        vaOnlineSchedulingCCDirectScheduling: true,
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingUseV2ApiRequests: true,
        vaOnlineSchedulingFeatureBreadcrumbUrlUpdate: true,
      });

      // Mock the appointments API
      mockAppointmentsGetApi({
        response: {
          data: MockAppointmentResponse.getUpcomingAppointments(),
          meta: { pagination: { totalEntries: 0 } },
        },
      });

      // Setup VAOS app
      vaosSetup();

      // Visit the appointments page
      cy.visit('/my-health/appointments');
    });

    it('should navigate to the Referrals and Requests page', () => {
      // Check that we're on the appointments page
      cy.findByRole('heading', { level: 1, name: 'Appointments' }).should(
        'exist',
      );

      // Perform accessibility check on the appointments page
      cy.injectAxeThenAxeCheck();

      // Click the "Review requests and referrals" link
      appointmentList.navigateToReferralsAndRequests();

      // Perform accessibility check on the referrals and requests page
      cy.injectAxeThenAxeCheck();

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
    });
  });
});
