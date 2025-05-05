import claims from '../../fixtures/test-data.json';

class ApiInitializer {
  initializeFeatureToggle = {
    withAllFeatures: () => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'travel_pay_power_switch', value: true },
            { name: 'travel_pay_view_claim_details', value: true },
            { name: 'travel_pay_submit_mileage_expense', value: true },
            { name: 'travel_pay_claims_management', value: true },
          ],
        },
      }).as('featureToggles');
    },
  };

  initializeClaims = {
    happyPath: () => {
      cy.intercept('GET', '/travel_pay/v0/claims', claims).as('sm');
    },
  };

  initializeClaimDetails = {
    happyPath: () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        fixture:
          'applications/travel-pay/tests/fixtures/travel-claim-details-v1.json',
      }).as('details');
    },
  };

  submitClaim = {
    happyPath: () => {
      cy.intercept('POST', '/travel_pay/v0/claims', {
        statusCode: 200,
        body: {
          data: {
            claimId: '12345',
          },
        },
      });
    },
    errorPath: () => {
      cy.intercept('POST', '/travel_pay/v0/claims', {
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
      cy.intercept('GET', '/vaos/v2/appointments/*', {
        fixture: 'applications/travel-pay/tests/fixtures/appointment.json',
      }).as('appointment');
    },
  };

  initialMaintenanceWindow = {
    none: () => {
      cy.intercept('GET', '/v0/maintenance_windows', {
        statusCode: 200,
        body: {
          data: [],
        },
      }).as('maintenanceWindow');
    },
    upcoming: () => {
      const now = new Date();
      const oneDayAgo = new Date(
        now.getTime() - 24 * 60 * 60 * 1000,
      ).toISOString();
      const oneDayLater = new Date(
        now.getTime() + 24 * 60 * 60 * 1000,
      ).toISOString();

      cy.intercept('GET', '/v0/maintenance_windows', {
        statusCode: 200,
        body: {
          data: [
            {
              id: '319',
              type: 'maintenance_window',
              attributes: {
                id: 319,
                externalService: 'travel_pay_api',
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
