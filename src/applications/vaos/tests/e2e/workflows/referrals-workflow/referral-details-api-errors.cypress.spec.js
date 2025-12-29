import { mockFeatureToggles } from '../../vaos-cypress-helpers';
import {
  mockAppointmentDetailsApi,
  saveScreenshot,
} from './referrals-cypress-helpers';
import MockUser from '../../../fixtures/MockUser';
import MockReferralAppointmentDetailsResponse from '../../../fixtures/MockReferralAppointmentDetailsResponse';
import epsAppointmentDetails from '../../referrals/page-objects/EpsAppointmentDetails';

describe('Referral Appointment Details API Errors', () => {
  // Common error cases for all API tests
  const errorCases = [
    { errorType: 'notFound', responseCode: 404 },
    { errorType: 'serverError', responseCode: 500 },
  ];

  const appointmentId = 'EEKoGzEf';

  // Set up the base app state before each test
  beforeEach(() => {
    // Set required feature flags
    mockFeatureToggles({
      vaOnlineSchedulingCCDirectScheduling: true,
      vaOnlineSchedulingFlatFacilityPage: true,
      vaOnlineSchedulingUseV2ApiRequests: true,
    });

    // Setup VAOS app
    // vaosSetup();
    // mockVamcEhrApi();
    cy.login(new MockUser());
  });

  errorCases.forEach(({ errorType, responseCode }) => {
    it(`should display an error message when appointment details returns ${responseCode}`, () => {
      // Mock error response - MUST be set up BEFORE visiting the page
      const appointmentDetailsResponse = new MockReferralAppointmentDetailsResponse(
        {
          appointmentId,
          [errorType]: true,
        },
      ).toJSON();
      mockAppointmentDetailsApi({
        id: appointmentId,
        response: appointmentDetailsResponse,
        responseCode,
      });

      // Visit the appointments page AFTER setting up the mock
      cy.visit('/my-health/appointments/EEKoGzEf?eps=true');

      // Wait for appointment details API call
      cy.wait('@v2:get:appointmentDetails');
      epsAppointmentDetails.assertApiError();
      cy.injectAxeThenAxeCheck();
      saveScreenshot(
        `vaos_ccDirectScheduling_appointmentDetails_apiError_${errorType}`,
      );
    });
  });
});
