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
}

export default new ApiInitializer();
