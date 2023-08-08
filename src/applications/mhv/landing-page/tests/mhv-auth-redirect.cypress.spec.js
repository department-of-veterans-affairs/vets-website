import manifest from '../manifest.json';
import { generateFeatureToggles } from '../api/mocks/feature-toggles';
import { defaultUser, cernerUser, noFacilityUser } from '../api/mocks/user';

describe(`${manifest.appName} Auth Redirect`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
    cy.intercept('GET', '/my_health/v1/messaging/folders*', {});
  });

  describe('unauthenticated user', () => {
    it('prompts user to authenticate, redirecting to /my-health', () => {
      cy.visit('/my-health');
      cy.get('#signin-signup-modal').should('be.visible');
      cy.url().should('contain', '?next=%2Fmy-health');
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('default user', () => {
    it('renders the landing page', () => {
      cy.intercept('GET', '/v0/user*', defaultUser);
      cy.login(defaultUser);
      cy.visit('/my-health');
      cy.get('h1').should('include.text', 'My HealtheVet');
      cy.axeCheck();
    });
  });

  describe('cerner patient', () => {
    it('renders the landing page', () => {
      cy.intercept('GET', '/v0/user*', cernerUser);
      cy.login(cernerUser);
      cy.visit('/my-health');
      cy.get('h1').should('include.text', 'My HealtheVet');
      cy.axeCheck();
    });
  });

  describe('unauthorized user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to MHV National Portal', () => {
      cy.intercept('GET', '/v0/user*', noFacilityUser);
      cy.login(noFacilityUser);
      cy.visit('/my-health');
      cy.url().should('not.include', '/my-health');
    });
  });
});
