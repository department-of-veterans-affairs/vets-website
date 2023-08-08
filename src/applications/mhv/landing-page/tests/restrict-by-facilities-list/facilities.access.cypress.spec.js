import manifest from '../../manifest.json';
import { generateFeatureToggles } from '../../api/mocks/feature-toggles';
import { defaultUser, noFacilityUser } from '../../api/mocks/user';

describe(manifest.appName, () => {
  describe('restrict access based on patient facilities', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.intercept('GET', '/my_health/v1/messaging/folders*', {});
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('landing page is disabled for patients with no facilities', () => {
      cy.intercept('GET', '/v0/user*', noFacilityUser);
      cy.login(noFacilityUser);
      cy.visit('/my-health');
      cy.url().should('not.include', '/my-health');
    });

    it('landing page is enabled for patients with facilities', () => {
      cy.intercept('GET', '/v0/user*', defaultUser);
      cy.login(defaultUser);
      cy.visit('/my-health');
      cy.get('h1').should('include.text', 'My HealtheVet');
      cy.axeCheck();
    });
  });
});
