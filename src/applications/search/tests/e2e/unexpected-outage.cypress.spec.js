import { SELECTORS as s } from './helpers';

describe('Unexpected outage from Search.gov', () => {
  const enableToggle = () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: 'search_gov_maintenance',
            value: true,
          },
        ],
      },
    });
  };

  const verifyBanner = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.OUTAGE_BOX)
        .should('exist')
        .and('contain', 'We’re working on Search VA.gov right now.');
    });
  };

  const verifyNoResults = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_RESULTS).should('not.exist');
      cy.get(s.SEARCH_RESULTS_TITLE).should('not.exist');
    });
  };

  it('should show the outage banner when the toggle is on', () => {
    enableToggle();
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifyBanner();
    verifyNoResults();
  });
});
