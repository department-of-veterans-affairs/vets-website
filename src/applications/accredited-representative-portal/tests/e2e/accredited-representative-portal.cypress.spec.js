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
const POA_REQUESTS =
  '/representative/representation-requests?useMockData&useMockUser&status=pending&sort=created_at_asc&pageSize=20&pageNumber=1';

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
  cy.injectAxeThenAxeCheck();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is enabled, but Pilot feature toggle is not enabled', () => {
    beforeEach(() => {
      setUpInterceptsAndVisit({
        isAppEnabled: true,
        isInPilot: false,
      });
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

    it('allows navigation from the Landing Page to the POA Requests Page and back', () => {
      cy.injectAxeThenAxeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
      cy.visit(POA_REQUESTS);

      cy.get('[data-testid=desktop-logo').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
    });
  });
});
