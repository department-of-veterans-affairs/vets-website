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
  cy.injectAxeThenAxeCheck();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is enabled, but Help feature toggle is not enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit({
        isAppEnabled: true,
        isInPilot: true,
        isHelpEnabled: false,
      });
    });

    it('does not show the Get Help nav link', () => {
      cy.injectAxeThenAxeCheck();

      cy.get('.nav__container-secondary').should('not.have.text', 'Get Help');
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit({
        isAppEnabled: true,
        isInPilot: true,
        isHelpEnabled: true,
      });
    });

    it('allows navigation from the Landing Page to the Get Help Page and back', () => {
      cy.injectAxeThenAxeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
      cy.get('[data-testid=heading-help-link]').click();
      cy.injectAxeThenAxeCheck();
      cy.get('h1').should(
        'have.text',
        'Get help with the Accredited Representative Portal',
      );

      cy.get('[data-testid=desktop-logo').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
    });
  });
});
