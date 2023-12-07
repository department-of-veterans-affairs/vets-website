import vamcEhr from '../../fixtures/vamc-ehr.json';

const medicationFeatureToggles = (enabled = true) => ({
  data: {
    type: 'feature_toggles',
    features: [
      {
        name: 'mhv_medications_to_va_gov_release',
        value: enabled,
      },
    ],
  },
});

describe('Medications Landing Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
  });

  it('visits Medications landing Page', () => {
    cy.intercept('GET', '/v0/feature_toggles*', medicationFeatureToggles(true));
    cy.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('redirects from Medications landing Page when feature toggle is off', () => {
    const redirectPath = '/health-care/refill-track-prescriptions';
    cy.intercept('GET', redirectPath, '').as('refillRedirect');
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      medicationFeatureToggles(false),
    );

    // Login when feature disabled, expect redirect
    cy.login();
    cy.visit('my-health/about-medications/');

    cy.wait('@refillRedirect');
  });
});
