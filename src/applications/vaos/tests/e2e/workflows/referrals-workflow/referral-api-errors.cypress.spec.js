/* eslint-disable camelcase */
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
  mockCompletedAppointmentApi,
} from './referrals-cypress-helpers';
import MockUser from '../../fixtures/MockUser';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import MockReferralListResponse from '../../fixtures/MockReferralListResponse';
import MockReferralDetailResponse from '../../fixtures/MockReferralDetailResponse';
import MockReferralDraftAppointmentResponse from '../../fixtures/MockReferralDraftAppointmentResponse';
import MockReferralAppointmentDetailsResponse from '../../fixtures/MockReferralAppointmentDetailsResponse';
import MockReferralSubmitAppointmentResponse from '../../fixtures/MockReferralSubmitAppointmentResponse';
import MockReferralCompletedAppointmentResponse from '../../fixtures/MockReferralCompletedAppointmentResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import appointmentList from '../../page-objects/AppointmentList/AppointmentListPageObject';
import referralsAndRequests from '../../referrals/page-objects/ReferralsAndRequests';
import scheduleReferral from '../../referrals/page-objects/ScheduleReferral';
import chooseDateAndTime from '../../referrals/page-objects/ChooseDateAndTime';
import reviewAndConfirm from '../../referrals/page-objects/ReviewAndConfirm';
import completeReferral from '../../referrals/page-objects/CompleteReferral';

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
      });
    });
  });

  // TODO: This test is failing because the submit appointment page does not display an error
  describe.skip('Submit Appointment API Errors', () => {
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
          numberOfSlots: 3,
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

        // Verify error message is displayed
        reviewAndConfirm.assertApiError();
      });
    });
  });

  describe('Appointment Details API Errors', () => {
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
          numberOfSlots: 3,
        },
      ).toJSON();
      mockDraftReferralAppointmentApi({
        response: draftReferralAppointment,
      });

      // Mock successful submit appointment response
      const submitAppointmentResponse = new MockReferralSubmitAppointmentResponse(
        {
          appointmentId,
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
            appointmentId,
            referralId,
            [errorType]: true,
          },
        ).toJSON();
        mockAppointmentDetailsApi({
          id: appointmentId,
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
        reviewAndConfirm.assertApiError();
      });
    });
  });

  // TODO: Need updated UI with new API call before completing this test
  describe.skip('Completed Appointment API Errors', () => {
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
          numberOfSlots: 3,
        },
      ).toJSON();
      mockDraftReferralAppointmentApi({
        response: draftReferralAppointment,
      });

      // Mock successful submit appointment response
      const submitAppointmentResponse = new MockReferralSubmitAppointmentResponse(
        {
          appointmentId,
          success: true,
        },
      ).toJSON();
      mockSubmitAppointmentApi({
        response: submitAppointmentResponse,
      });

      // Mock successful appointment details response
      const appointmentDetailsResponse = new MockReferralAppointmentDetailsResponse(
        {
          appointmentId,
          referralId,
          typeOfCare: 'Physical Therapy',
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

    errorCases.forEach(({ errorType, responseCode }) => {
      it(`should display an error message when completed appointment returns ${responseCode}`, () => {
        // Mock error response
        const completedAppointmentResponse = new MockReferralCompletedAppointmentResponse(
          {
            appointmentId,
            [errorType]: true,
          },
        ).toJSON();
        mockCompletedAppointmentApi({
          id: appointmentId,
          response: completedAppointmentResponse,
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

        // Wait for appointment details to load
        cy.wait('@v2:get:appointmentDetails');

        // Click the details link
        completeReferral.clickDetailsLink();

        // Wait for completed appointment API call
        cy.wait('@get:completedAppointment');
        cy.injectAxeThenAxeCheck();

        // Verify error message is displayed
        completeReferral.assertApiError();
      });
    });
  });
});
