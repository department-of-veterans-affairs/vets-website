import { SELECTORS as s } from './helpers';
import stub from '../../constants/stub.json';
import zeroResultsStub from '../../constants/stubZeroResults.json';

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

  const disableToggle = () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: 'search_gov_maintenance',
            value: false,
          },
        ],
      },
    });
  };

  const mockResultsEmpty = () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: zeroResultsStub,
      statusCode: 200,
    }).as('getSearchResultsGlobal');
  };

  const mockResults = () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: stub,
      statusCode: 200,
    }).as('getSearchResultsGlobal');
  };

  const mockResultsFailure = () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      errors: [
        {
          title: 'Service unavailable',
          detail:
            'An outage has been reported on the Search/Results since 2024-10-22 17:02:09 UTC',
          code: '503',
          status: '503',
        },
      ],
    }).as('getSearchResultsGlobal');
  };

  const checkForResults = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      cy.get(s.SEARCH_RESULTS).should('be.visible');
      cy.get(s.SEARCH_RESULTS_TITLE).should('have.length.at.least', 1);
    });
  };

  const verifyMaintanenceBanner = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.OUTAGE_BOX)
        .should('exist')
        .and('contain', 'We’re working on Search VA.gov right now.');
      cy.get(s.ERROR_ALERT_BOX).should('not.exist');
    });
  };

  const verifyNoResults = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_RESULTS).should('not.exist');
      cy.get(s.SEARCH_RESULTS_TITLE).should('not.exist');
    });
  };

  const verifySearchFailureBanner = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.ERROR_ALERT_BOX)
        .should('exist')
        .and('contain', 'Something went wrong on our end,');
      cy.get(s.OUTAGE_BOX).should('not.exist');
    });
  };

  it('should show the outage banner and results when the toggle is on and results are returned', () => {
    enableToggle();
    mockResults();
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifyMaintanenceBanner();
    checkForResults();
  });

  it('should show the outage banner and no results when the toggle is on and empty results are returned', () => {
    enableToggle();
    mockResultsEmpty();
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifyMaintanenceBanner();
    verifyNoResults();
  });

  it('should show the outage banner and no results when the toggle is on and the search call fails', () => {
    enableToggle();
    mockResultsFailure();
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifyMaintanenceBanner();
    verifyNoResults();
  });

  it('should show an error message and no results when the API encounters an error', () => {
    disableToggle();
    mockResultsFailure();
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();
    verifySearchFailureBanner();
    verifyNoResults();
  });
});
