import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import {
  mockReferralsGetApi,
  mockReferralDetailGetApi,
} from './referrals-cypress-helpers';
import MockUser from '../../../fixtures/MockUser';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockReferralListResponse from '../../../fixtures/MockReferralListResponse';
import MockReferralDetailResponse from '../../../fixtures/MockReferralDetailResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';
import scheduleReferral from '../../referrals/page-objects/ScheduleReferral';

describe('VAOS Referral Not in Pilot', () => {
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
      stationId: '12345',
    });
    mockAppointmentsGetApi({ response: [response] });

    // Setup VAOS app
    vaosSetup();
    mockVamcEhrApi();
    cy.login(new MockUser());

    // Visit the appointments page
    cy.visit('/my-health/appointments');
  });

  describe('Viewing a referral with a station id that is not in the pilot', () => {
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

    it('should show schedule appointment link on referral list page', () => {
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
      cy.findByTestId('referral-alert').should('exist');
      cy.findByTestId('referral-alert').should(
        'contain.text',
        'Call your community care provider or your facility’s community care office to schedule an appointment.',
      );

      cy.findAllByTestId('referral-community-care-office').should(
        'have.length',
        2,
      );
      cy.findByTestId('schedule-appointment-button').should('not.exist');
    });
  });
});
