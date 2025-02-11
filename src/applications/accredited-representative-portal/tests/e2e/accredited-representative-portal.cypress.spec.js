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
  cy.visit('/representative');
  cy.injectAxe();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is not enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit({
        isAppEnabled: false,
        isInPilot: false,
      });
    });

    it('redirects to VA.gov homepage when in production and app is not enabled', () => {
      cy.axeCheck();
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('App feature toggle is enabled, but Pilot feature toggle is not enabled', () => {
    beforeEach(() => {
      setUpInterceptsAndVisit({
        isAppEnabled: true,
        isInPilot: false,
      });
    });

    it('allows navigation from the Landing Page to unified sign-in page', () => {
      cy.axeCheck();
      cy.get('[data-testid=landing-page-sign-in-link]')
        .contains('Sign in or create account')
        .click();
      cy.location('pathname').should('eq', '/sign-in/');
    });

    // Bring back when repairing testing.
    it.skip('displays an alert when in production and when user is not in pilot', () => {
      cy.axeCheck();
      cy.loginArpUser();
      cy.get('[data-testid=not-in-pilot-alert]').should('exist');
      cy.get('[data-testid=not-in-pilot-alert-heading]').should(
        'have.text',
        'Accredited Representative Portal is currently in pilot',
      );
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit({
        isAppEnabled: true,
        isInPilot: true,
      });
    });

    /**
     * TODO: Unskip.
     * The POA request search page does a redirect by throwing a `redirect` from
     * its `react-router` data loader. But the cypress test is showing the
     * `errorElement` instead of where we were supposed to redirec to. And when
     * investigating with `useRouteError`, we see the thrown redirection. This
     * works outside cypress.
     */
    it.skip('allows navigation from the Landing Page to the POA Requests Page and back', () => {
      cy.axeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal, William',
      );

      cy.location('pathname').should('eq', '/representative/poa-requests');
      cy.axeCheck();

      cy.get('[data-testid=poa-requests-heading]').should(
        'have.text',
        'Power of attorney requests',
      );
      cy.get('[data-testid=poa-requests-card]').should('exist');

      cy.get('[data-testid=wider-than-mobile-logo-row-logo-link]').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal, William',
      );
    });
  });
});
