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
}

export default new ApiInitializer();
