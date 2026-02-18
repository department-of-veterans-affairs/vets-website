import claims from '../../fixtures/test-data.json';

const API_PATHS = {
  FEATURE_TOGGLES: '/v0/feature_toggles*',
  MAINTENANCE_WINDOWS: '/v0/maintenance_windows',
  CLAIMS: '/travel_pay/v0/claims',
  CLAIMS_SUBMISSION: '/travel_pay/v0/claims',
  CLAIM_DETAILS: '/travel_pay/v0/claims/*',
  APPOINTMENT: '/vaos/v2/appointments/*',
};

class ApiInitializer {
  initializeFeatureToggle = {
    withAllFeatures: () => {
      cy.intercept('GET', API_PATHS.FEATURE_TOGGLES, {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'travel_pay_power_switch', value: true },
            { name: 'travel_pay_view_claim_details', value: true },
            { name: 'travel_pay_submit_mileage_expense', value: true },
            { name: 'travel_pay_claims_management', value: true },
            { name: 'travel_pay_enable_complex_claims', value: true },
          ],
        },
      }).as('featureToggles');
    },
    withSmocOnly: () => {
      cy.intercept('GET', API_PATHS.FEATURE_TOGGLES, {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'travel_pay_power_switch', value: true },
            { name: 'travel_pay_view_claim_details', value: true },
            { name: 'travel_pay_submit_mileage_expense', value: true },
            { name: 'travel_pay_claims_management', value: true },
            { name: 'travel_pay_enable_complex_claims', value: false },
          ],
        },
      }).as('featureToggles');
    },
  };

  initializeClaims = {
    happyPath: () => {
      cy.intercept(
        'GET',
        `${
          API_PATHS.CLAIMS
        }?start_date=2024-03-25T00:00:00&end_date=2024-06-25T23:59:59`,
        claims,
      ).as('sm');
    },
    errorPath: () => {
      cy.intercept('GET', `${API_PATHS.CLAIMS}?*`, {
        statusCode: 503,
        body: {
          errors: [
            {
              title: 'Service unavailable',
              status: 503,
              detail: 'An unknown error has occurred.',
              code: 'VA900',
            },
          ],
        },
      }).as('smError');
    },
  };

  additionalClaims = {
    happyPath: () => {
      cy.intercept(
        'GET',
        `${
          API_PATHS.CLAIMS
        }?start_date=2024-01-01T00:00:00&end_date=2024-03-31T23:59:59`,
        {
          fixture: 'applications/travel-pay/tests/fixtures/test-data-2.json',
        },
      ).as('sm2');
    },
  };

  initializeClaimDetails = {
    happyPath: () => {
      cy.intercept('GET', API_PATHS.CLAIM_DETAILS, {
        fixture:
          'applications/travel-pay/tests/fixtures/travel-claim-details-v1.json',
      }).as('details');
      // Intercept appointment by date endpoint with matching appointment
      // This appointment's localStartTime matches the appointmentDateTime in travel-claim-details-v1.json
      cy.intercept('GET', '/vaos/v2/appointments?*', {
        data: [
          {
            id: '167322',
            type: 'appointment',
            attributes: {
              kind: 'clinic',
              id: '167322',
              localStartTime: '2024-01-01T16:45:34.465Z',
              serviceName: 'COVID VACCINE CLIN1',
              location: {
                id: '983',
                attributes: {
                  name: 'Cheyenne VA Medical Center',
                  timezone: { timeZoneId: 'America/Denver' },
                },
              },
            },
          },
        ],
      }).as('appointmentsByDate');
    },
    errorPath: () => {
      cy.intercept('GET', API_PATHS.CLAIM_DETAILS, {
        statusCode: 503,
        body: {
          errors: [
            {
              title: 'Service unavailable',
              status: 503,
              detail: 'An unknown error has occurred.',
              code: 'VA900',
            },
          ],
        },
      }).as('detailsError');
    },
  };

  submitClaim = {
    happyPath: () => {
      cy.intercept('POST', API_PATHS.CLAIMS_SUBMISSION, {
        statusCode: 200,
        body: {
          data: {
            claimId: '12345',
          },
        },
      });
    },
    errorPath: () => {
      cy.intercept('POST', API_PATHS.CLAIMS_SUBMISSION, {
        statusCode: 503,
        body: {
          errors: [
            {
              title: 'Service unavailable',
              status: 503,
              detail: 'An unknown error has occured.',
              code: 'VA900',
            },
          ],
        },
      });
    },
  };

  initializeAppointment = {
    happyPath: () => {
      cy.intercept('GET', API_PATHS.APPOINTMENT, {
        fixture: 'applications/travel-pay/tests/fixtures/appointment.json',
      }).as('appointment');
    },
    errorPath: () => {
      cy.intercept('GET', API_PATHS.APPOINTMENT, {
        statusCode: 503,
        body: {
          errors: [
            {
              title: 'Service unavailable',
              status: 503,
              detail: 'An unknown error has occurred.',
              code: 'VA900',
            },
          ],
        },
      }).as('appointmentError');
    },
    byDateTime: (appointmentDate = '2024-01-01T16:45:34.465Z') => {
      // Intercept the appointments list endpoint for getAppointmentDataByDateTime
      // Returns minimal appointment data to satisfy TravelClaimDetailsContent
      cy.intercept('GET', '/vaos/v2/appointments?*', {
        data: [
          {
            id: '167322',
            type: 'appointment',
            attributes: {
              kind: 'clinic',
              id: '167322',
              localStartTime: appointmentDate,
              serviceName: 'Test Service',
              location: {
                id: '983',
                attributes: {
                  name: 'Test VA Medical Center',
                  timezone: { timeZoneId: 'America/Denver' },
                },
              },
            },
          },
        ],
      }).as('appointmentsByDate');
    },
  };

  initializeMaintenanceWindow = {
    none: () => {
      cy.intercept('GET', '/v0/maintenance_windows', {
        statusCode: 200,
        body: {
          data: [],
        },
      }).as('maintenanceWindow');
    },
    current: () => {
      const now = new Date();
      const oneDayAgo = new Date(
        now.getTime() - 24 * 60 * 60 * 1000,
      ).toISOString();
      const oneDayLater = new Date(
        now.getTime() + 24 * 60 * 60 * 1000,
      ).toISOString();

      cy.intercept('GET', API_PATHS.MAINTENANCE_WINDOWS, {
        statusCode: 200,
        body: {
          data: [
            {
              id: '319',
              type: 'maintenance_window',
              attributes: {
                id: 319,
                externalService: 'travel_pay',
                startTime: oneDayAgo,
                endTime: oneDayLater,
                description: '',
              },
            },
          ],
        },
      }).as('maintenanceWindow');
    },
  };
}

export default new ApiInitializer();
