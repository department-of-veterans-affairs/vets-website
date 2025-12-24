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
import { mockToday, mockTodayPlus6Hours } from '../../../mocks/constants';

describe('VAOS Referral API Error Handling', () => {
  // Common error cases for all API tests
  const errorCases = [
    { errorType: 'notFound', responseCode: 404 },
    { errorType: 'serverError', responseCode: 500 },
  ];

  // Set up the base app state before each test
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
      localStartTime: mockToday,
      status: APPOINTMENT_STATUS.booked,
    });
    mockAppointmentsGetApi({ response: [response] });

    // Setup VAOS app
    vaosSetup();
    mockVamcEhrApi();
    cy.login(new MockUser());

    // Visit the appointments page
    cy.visit('/my-health/appointments');

    cy.clock(mockToday, ['Date']);
  });

  describe('Referrals List API Errors', () => {
    errorCases.forEach(({ errorType, responseCode }) => {
      it(`should display an error message when referrals list returns ${responseCode}`, () => {
        // Mock error response
        const referralsResponse = new MockReferralListResponse({
          [errorType]: true,
        }).toJSON();
        mockReferralsGetApi({ response: referralsResponse, responseCode });

        // Navigate to the Referrals and Requests page
        appointmentList.navigateToReferralsAndRequests();

        // Wait for referrals API call
        cy.wait('@v2:get:referrals');
        cy.injectAxeThenAxeCheck();

        // Verify error message is displayed
        referralsAndRequests.assertApiError();
        saveScreenshot(
          `vaos_ccDirectScheduling_referralsList_apiError_${errorType}`,
        );
      });
    });
  });

  describe('Referral Detail API Errors', () => {
    beforeEach(() => {
      // Mock successful referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 2,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });
    });

    errorCases.forEach(({ errorType, responseCode }) => {
      it(`should display an error message when referral detail returns ${responseCode}`, () => {
        // Mock error response
        const referralDetailResponse = new MockReferralDetailResponse({
          [errorType]: true,
        }).toJSON();
        mockReferralDetailGetApi({
          response: referralDetailResponse,
          responseCode,
        });

        // Navigate to the Referrals and Requests page
        appointmentList.navigateToReferralsAndRequests();

        // Wait for referrals to load
        cy.wait('@v2:get:referrals');

        // Select the first referral
        referralsAndRequests.selectReferral(0);

        // Wait for referral detail API call
        cy.wait('@v2:get:referral:detail');
        cy.injectAxeThenAxeCheck();

        // Verify error message is displayed
        scheduleReferral.assertApiError();
        saveScreenshot(
          `vaos_ccDirectScheduling_referralDetail_apiError_${errorType}`,
        );
      });
    });
  });

  describe('Draft Referral Appointment API Errors', () => {
    const referralId = 'referral-123';

    beforeEach(() => {
      // Mock successful referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 1,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });

      // Mock successful referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        hasAppointments: false,
      }).toJSON();
      mockReferralDetailGetApi({
        response: referralDetailResponse,
      });
    });

    errorCases.forEach(({ errorType, responseCode }) => {
      it(`should display an error message when draft appointment returns ${responseCode}`, () => {
        // Mock error response
        const draftReferralAppointment = new MockReferralDraftAppointmentResponse(
          {
            referralId,
            [errorType]: true,
            currentDate: mockToday,
          },
        ).toJSON();
        mockDraftReferralAppointmentApi({
          response: draftReferralAppointment,
          responseCode,
        });

        // Navigate to the Referrals and Requests page
        appointmentList.navigateToReferralsAndRequests();

        // Wait for referrals to load
        cy.wait('@v2:get:referrals');

        // Select the first referral
        referralsAndRequests.selectReferral(0);

        // Wait for referral detail to load
        cy.wait('@v2:get:referral:detail');

        // Click the schedule appointment button
        scheduleReferral.clickScheduleAppointment();

        // Wait for draft referral appointment API call
        cy.wait('@v2:post:draftReferralAppointment');
        cy.injectAxeThenAxeCheck();

        // Verify error message is displayed
        chooseDateAndTime.assertApiError();
        saveScreenshot(
          `vaos_ccDirectScheduling_selectingSlotTimes_apiError_${errorType}`,
        );
      });
    });
  });

  describe('Submit Appointment API Errors', () => {
    const referralId = 'referral-123';
    const appointmentId = 'EEKoGzEf';

    beforeEach(() => {
      // Mock successful referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 1,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });

      // Mock successful referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        hasAppointments: false,
      }).toJSON();
      mockReferralDetailGetApi({
        response: referralDetailResponse,
      });

      // Mock successful draft referral appointment response
      const draftReferralAppointment = new MockReferralDraftAppointmentResponse(
        {
          referralId,
          categoryOfCare: 'Physical Therapy',
          currentDate: mockToday,
        },
      ).toJSON();
      mockDraftReferralAppointmentApi({
        response: draftReferralAppointment,
      });
    });

    errorCases.forEach(({ errorType, responseCode }) => {
      it(`should display an error message when submit appointment returns ${responseCode}`, () => {
        // Mock error response
        const submitAppointmentResponse = new MockReferralSubmitAppointmentResponse(
          {
            appointmentId,
            [errorType]: true,
          },
        ).toJSON();
        mockSubmitAppointmentApi({
          response: submitAppointmentResponse,
          responseCode,
        });

        // Navigate to the Referrals and Requests page
        appointmentList.navigateToReferralsAndRequests();

        // Wait for referrals to load
        cy.wait('@v2:get:referrals');

        // Select the first referral
        referralsAndRequests.selectReferral(0);

        // Wait for referral detail to load
        cy.wait('@v2:get:referral:detail');

        // Click the schedule appointment button
        scheduleReferral.clickScheduleAppointment();

        // Wait for draft referral appointment to load
        cy.wait('@v2:post:draftReferralAppointment');

        // Select the first appointment slot
        chooseDateAndTime.selectNextMonth();
        chooseDateAndTime.selectAppointmentSlot(0);
        cy.findAllByRole('radio')
          .eq(0)
          .click();

        // Click continue to proceed with scheduling
        chooseDateAndTime.clickContinue();

        // Click the continue button to finalize the appointment
        reviewAndConfirm.clickContinue();

        // Wait for submit appointment API call
        cy.wait('@v2:post:submitAppointment');
        cy.injectAxeThenAxeCheck();
        saveScreenshot(
          `vaos_ccDirectScheduling_reviewAndConfirm_apiError_${errorType}`,
        );

        // Verify error message is displayed
        reviewAndConfirm.assertApiErrorAlert();
      });
    });
  });

  describe('Appointment Details API Errors after submit appointment', () => {
    const referralId = 'referral-123';
    const draftAppointmentId = 'appointment-for-PmDYsBz-egEtG13flMnHUQ==';

    beforeEach(() => {
      // Mock successful referrals list response
      const referralsResponse = new MockReferralListResponse({
        numberOfReferrals: 1,
      }).toJSON();
      mockReferralsGetApi({ response: referralsResponse });

      // Mock successful referral detail response
      const referralDetailResponse = new MockReferralDetailResponse({
        hasAppointments: false,
      }).toJSON();
      mockReferralDetailGetApi({
        response: referralDetailResponse,
      });

      // Mock successful draft referral appointment response
      const draftReferralAppointment = new MockReferralDraftAppointmentResponse(
        {
          referralId,
          categoryOfCare: 'Physical Therapy',
          numberOfSlots: 3,
          currentDate: mockToday,
        },
      ).toJSON();
      mockDraftReferralAppointmentApi({
        response: draftReferralAppointment,
      });

      // Mock successful submit appointment response
      const submitAppointmentResponse = new MockReferralSubmitAppointmentResponse(
        {
          draftAppointmentId,
          success: true,
        },
      ).toJSON();
      mockSubmitAppointmentApi({
        response: submitAppointmentResponse,
      });
    });

    errorCases.forEach(({ errorType, responseCode }) => {
      it(`should display an error message when appointment details returns ${responseCode}`, () => {
        // Mock error response
        const appointmentDetailsResponse = new MockReferralAppointmentDetailsResponse(
          {
            draftAppointmentId,
            [errorType]: true,
          },
        ).toJSON();
        mockAppointmentDetailsApi({
          id: '*',
          response: appointmentDetailsResponse,
          responseCode,
        });

        // Navigate to the Referrals and Requests page
        appointmentList.navigateToReferralsAndRequests();

        // Wait for referrals to load
        cy.wait('@v2:get:referrals');

        // Select the first referral
        referralsAndRequests.selectReferral(0);

        // Wait for referral detail to load
        cy.wait('@v2:get:referral:detail');

        // Click the schedule appointment button
        scheduleReferral.clickScheduleAppointment();

        // Wait for draft referral appointment to load
        cy.wait('@v2:post:draftReferralAppointment');

        // Select the first appointment slot
        chooseDateAndTime.selectNextMonth();
        chooseDateAndTime.selectAppointmentSlot(0);
        cy.findAllByRole('radio')
          .eq(0)
          .click();

        // Click continue to proceed with scheduling
        chooseDateAndTime.clickContinue();

        // Click the continue button to finalize the appointment
        reviewAndConfirm.clickContinue();

        // Wait for submit appointment response
        cy.wait('@v2:post:submitAppointment');

        // Wait for appointment details API call
        cy.wait('@v2:get:appointmentDetails');
        cy.injectAxeThenAxeCheck();

        // Verify error message is displayed
        completeReferral.assertApiError();
        saveScreenshot(
          `vaos_ccDirectScheduling_appointmentSubmit_apiError_${errorType}`,
        );
      });
    });

    it('should display an error when appointment remains in proposed state and times out', () => {
      // Mock appointment details to always return proposed status (never transitions to booked)
      const proposedAppointmentResponse = new MockReferralAppointmentDetailsResponse(
        {
          draftAppointmentId,
          typeOfCare: 'OPTOMETRY',
          providerName: 'Dr. Bones',
          organizationName: 'Meridian Health',
          status: 'proposed',
          success: true,
        },
      ).toJSON();

      // Use the simpler mock - app will handle polling internally
      mockAppointmentDetailsApi({
        id: draftAppointmentId,
        response: proposedAppointmentResponse,
      });

      // Navigate to the Referrals and Requests page
      appointmentList.navigateToReferralsAndRequests();

      // Wait for referrals to load
      cy.wait('@v2:get:referrals');

      // Select the first referral
      referralsAndRequests.selectReferral(0);

      // Wait for referral detail to load
      cy.wait('@v2:get:referral:detail');

      // Click the schedule appointment button
      scheduleReferral.clickScheduleAppointment();

      // Wait for draft referral appointment to load
      cy.wait('@v2:post:draftReferralAppointment');

      // Select the first appointment slot
      chooseDateAndTime.selectNextMonth();
      chooseDateAndTime.selectAppointmentSlot(0);
      cy.findAllByRole('radio')
        .eq(0)
        .click();

      // Click continue to proceed with scheduling
      chooseDateAndTime.clickContinue();

      // Click the continue button to finalize the appointment
      reviewAndConfirm.clickContinue();

      // Reset clock, using mockTodayPlus6Hours for request timeout.
      cy.clock().then(clock => clock.restore());
      cy.clock(mockTodayPlus6Hours, ['Date']);

      // Wait for submit appointment response
      cy.wait('@v2:post:submitAppointment');

      // Wait for at least two requests to make sure we are polling
      cy.wait('@v2:get:appointmentDetails', { timeout: 10000 });
      cy.wait('@v2:get:appointmentDetails', { timeout: 10000 });

      // Advance time by 35 seconds (beyond the app's 30-second timeout)
      cy.clock().then(clock => clock.tick(35000));

      // Verify error message is displayed
      completeReferral.assertNotBookedError();
      cy.injectAxeThenAxeCheck();
      saveScreenshot(`vaos_ccDirectScheduling_appointmentSubmit_timeoutError`);
    });
  });
});
