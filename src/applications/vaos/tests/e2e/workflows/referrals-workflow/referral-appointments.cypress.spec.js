/* eslint-disable camelcase */
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockUser from '../../fixtures/MockUser';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';

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

      // Mock the appointments API to at least have one appointment
      const response = new MockAppointmentResponse({
        cancellable: false,
        localStartTime: Date(),
        status: APPOINTMENT_STATUS.booked,
      });
      mockAppointmentsGetApi({ response: [response] });

      // Setup VAOS app
      vaosSetup();
      mockFeatureToggles({ vaOnlineSchedulingCCDirectScheduling: true });
      mockVamcEhrApi();
      cy.login(new MockUser());

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

      // Validate we're on the appointments page
      appointmentList.validate();

      // Click the "Review requests and referrals" link
      appointmentList.navigateToReferralsAndRequests();

      // Perform accessibility check on the referrals and requests page
      cy.injectAxeThenAxeCheck();

      // Validate we're on the referrals and requests page
      referralsAndRequests.validate();
    });
  });
});
