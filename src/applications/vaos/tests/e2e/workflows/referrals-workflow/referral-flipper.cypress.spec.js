import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockUser from '../../../fixtures/MockUser';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';

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
});
