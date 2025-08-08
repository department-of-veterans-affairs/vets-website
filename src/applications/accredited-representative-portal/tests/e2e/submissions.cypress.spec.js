import user from './fixtures/mocks/user.json';
import { setFeatureToggles } from './intercepts/feature-toggles';
import { setSubmissions } from './intercepts/submissions';

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const SUBMISSIONS_PAGE =
  '/representative/submissions?sortOrder=desc&sortBy=created_at&pageSize=20&pageNumber=1';

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '**/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

const setUpInterceptsAndVisit = (featureToggles, url) => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(
    featureToggles || {
      isAppEnabled: true,
      isInPilot: true,
      isSubmissionsEnabled: true,
    },
  );
  cy.visit(url || '/representative');
  cy.injectAxeThenAxeCheck();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is enabled, but submissions feature toggle is not enabled', () => {
    beforeEach(() => {
      setUpInterceptsAndVisit(
        {
          isAppEnabled: true,
          isInPilot: true,
          isSubmissionsEnabled: false,
        },
        SUBMISSIONS_PAGE,
      );

      it('redirects to representative home', () => {
        cy.injectAxeThenAxeCheck();
        cy.location('pathname').should('eq', '/representative');
      });
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      setSubmissions();
      cy.loginArpUser();
      setUpInterceptsAndVisit(null, SUBMISSIONS_PAGE);
    });

    it('Allows the user to see the Submissions page when visiting directly', () => {
      cy.injectAxeThenAxeCheck();
      cy.contains('Recent Submissions').should('be.visible');
    });

    it('Shows data mock fetched from backend', () => {
      cy.injectAxeThenAxeCheck();
      cy.contains('Snyder, John').should('be.visible');
      cy.contains('Anderson, Montgomery').should('be.visible');
      cy.contains('Fahey, Isias').should('be.visible');
    });
  });
});
