import manifest from 'applications/mhv/landing-page/manifest.json';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

describe(manifest.appName, () => {
  it('shows the My VA link when enabled', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: featureFlagNames.myVaShowHeaderLink,
            value: true,
          },
        ],
      },
    });
    cy.visit('/');
    cy.injectAxeThenAxeCheck();

    cy.get('[data-e2e-id^="my-va-"]').should('exist');
  });

  it('hides the My VA link when disabled', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: featureFlagNames.myVaShowHeaderLink,
            value: false,
          },
        ],
      },
    });
    cy.visit('/');
    cy.injectAxeThenAxeCheck();

    cy.get('[data-e2e-id^="my-va-"]').should('not.exist');
  });
});
