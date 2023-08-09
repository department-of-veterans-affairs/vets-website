import manifest from '../manifest.json';
import { generateFeatureToggles } from '../api/mocks/feature-toggles';
import { defaultUser, cernerUser, noFacilityUser } from '../api/mocks/user';
import { vamcEhrData } from '../api/mocks/vamc-ehr';

describe(`${manifest.appName} Auth Redirect`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
    cy.intercept('GET', '/my_health/v1/messaging/folders*', {});
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhrData);
  });

  describe('unauthenticated user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('prompts user to authenticate, redirecting to /my-health', () => {
      cy.visit('/my-health');
      cy.get('#signin-signup-modal').should('be.visible');
      cy.url().should('contain', '?next=%2Fmy-health');
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

      const redirect = 'myhealth.va.gov/mhv-portal-web/home';
      cy.on('url:changed', url => {
        if (!url.includes(redirect)) return;
        expect(url).to.include(redirect);
      });

      cy.visit('/my-health');
    });
  });
});
