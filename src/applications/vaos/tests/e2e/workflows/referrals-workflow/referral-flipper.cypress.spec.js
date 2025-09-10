import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import { mockReferralsGetApi } from './referrals-cypress-helpers';
import MockUser from '../../../fixtures/MockUser';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';
import MockReferralListResponse from '../../../fixtures/MockReferralListResponse';

describe('VAOS Referral Appointments', () => {
  beforeEach(() => {
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
  });

  describe('Community care flipper disabled', () => {
    beforeEach(() => {
      // Set required feature flags
      mockFeatureToggles({
        vaOnlineSchedulingCCDirectScheduling: false,
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingUseV2ApiRequests: true,
      });
    });

    it('should not show view referrals link', () => {
      cy.visit('/my-health/appointments');
      cy.injectAxeThenAxeCheck();
      appointmentList.validateViewReferralsLink({ exist: false });
    });
  });

  describe('Community care flipper enabled', () => {
    beforeEach(() => {
      // Set required feature flags
      mockFeatureToggles({
        vaOnlineSchedulingCCDirectScheduling: true,
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingUseV2ApiRequests: true,
      });
    });

    it('should show view referrals link', () => {
      cy.visit('/my-health/appointments');
      cy.injectAxeThenAxeCheck();
      appointmentList.validateViewReferralsLink({ exist: true });
    });
  });

  describe('Community care chiropractic flipper enabled', () => {
    beforeEach(() => {
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 4,
      });
      mockReferralsGetApi({ response: referralsResponse });
      // Set required feature flags
      mockFeatureToggles({
        vaOnlineSchedulingCCDirectScheduling: true,
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingUseV2ApiRequests: true,
        vaOnlineSchedulingCCDirectSchedulingChiropractic: true,
      });
    });

    it('should show view referrals link for chiropractic', () => {
      cy.visit('/my-health/appointments/referrals-requests');
      cy.injectAxeThenAxeCheck();
      referralsAndRequests.assertTypeOfCare({
        exist: true,
        typeOfCare: 'Chiropractic',
      });
    });
  });

  describe('Community care chiropractic flipper disabled', () => {
    beforeEach(() => {
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 4,
      });
      mockReferralsGetApi({ response: referralsResponse });
      // Set required feature flags
      mockFeatureToggles({
        vaOnlineSchedulingCCDirectScheduling: true,
        vaOnlineSchedulingFlatFacilityPage: true,
        vaOnlineSchedulingUseV2ApiRequests: true,
        vaOnlineSchedulingCCDirectSchedulingChiropractic: false,
      });
    });

    it('should not show view referrals link for chiropractic', () => {
      cy.visit('/my-health/appointments/referrals-requests');
      cy.injectAxeThenAxeCheck();
      referralsAndRequests.assertTypeOfCare({
        exist: false,
        typeOfCare: 'Chiropractic',
      });
    });
  });
});
