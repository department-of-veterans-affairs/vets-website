import user from './fixtures/mocks/user.json';
import { setFeatureToggles } from './intercepts/feature-toggles';

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '**/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

const setUpInterceptsAndVisit = featureToggles => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(featureToggles);
  cy.visit('/representative/accreditation/attorney-claims-agent-form-21a');
  cy.injectAxe();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is not enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit({
        isAppEnabled: false,
      });
    });

    it('redirects to VA.gov homepage when in production and app is not enabled', () => {
      cy.axeCheck();
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('App feature toggle is enabled', () => {
    beforeEach(() => {
      setUpInterceptsAndVisit({
        isAppEnabled: true,
      });
    });

    it('allows navigation from the 21a form intro to unified sign-in page', () => {
      cy.axeCheck();
      cy.get('a')
        .contains('Sign in to start your application')
        .click();
      cy.location('pathname').should('eq', '/sign-in/');
    });
  });
});
