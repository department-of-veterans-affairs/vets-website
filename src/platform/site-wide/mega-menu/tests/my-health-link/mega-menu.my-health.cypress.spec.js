import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import manifest from 'applications/mhv/landing-page/manifest.json';

import ApiInitializer from 'applications/mhv/landing-page/tests/e2e/utilities/ApiInitializer';
import LandingPage from 'applications/mhv/landing-page/tests/e2e/pages/LandingPage';

describe(manifest.appName, () => {
  it('shows the new link when enabled', () => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeUserData.withDefaultUser();
    LandingPage.visitPage({ serviceProvider: CSP_IDS.ID_ME });
    cy.injectAxeThenAxeCheck();
    cy.get('[data-e2e-id^="my-healthe-vet-"]')
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
    cy.get('[data-e2e-id^="my-healthe-vet-"]').should(
      'have.attr',
      'href',
      '/my-health/',
    );
  });
  it('shows the old link when disabled', () => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    ApiInitializer.initializeUserData.withDefaultUser();
    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-e2e-id^="my-healthe-vet-"]')
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
    cy.get('[data-e2e-id^="my-healthe-vet-"]')
      .should('have.attr', 'href')
      .and('include', 'mhv-portal-web/eauth');
  });
});
