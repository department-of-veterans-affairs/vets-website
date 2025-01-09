import stub from '../../constants/stub.json';
import zeroResultsStub from '../../constants/stubZeroResults.json';
import { SELECTORS as s } from './helpers';

describe('Search.gov maintenance window message', () => {
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

  const setClockAndSearch = date => {
    cy.clock(new Date(date).getTime(), ['Date']);
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();
  };

  const verifyBanner = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.MAINT_BOX)
        .should('exist')
        .and('contain', 'We’re working on Search VA.gov right now.');
    });
  };

  const verifyNoBanner = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.MAINT_BOX).should('not.exist');
    });
  };

  const checkForResults = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      cy.get(s.SEARCH_RESULTS).should('be.visible');
      cy.get(s.SEARCH_RESULTS_TITLE).should('have.length.at.least', 1);
    });
  };

  const verifyNoResults = () => {
    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      cy.get(s.SEARCH_RESULTS).should('not.exist');
      cy.get(s.SEARCH_RESULTS_TITLE).should('not.exist');
    });
  };

  it('should display maintenance message during maintenance window when 0 results on Tuesday at 4 PM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-16T20:00:00.000Z');
    verifyBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should display maintenance message during maintenance window when 0 results on Thursday at 4 PM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-18T20:00:00.000Z');
    verifyBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should display maintenance message during maintenance window when 0 results on Tuesday at 5 PM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-16T21:00:00.000Z');
    verifyBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should display maintenance message during maintenance window when 0 results on Thursday at 5 PM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-18T21:00:00.000Z');
    verifyBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should NOT display message if returns with search results at 4 PM EST on a Tuesday', () => {
    mockResults();
    setClockAndSearch('2021-03-16T20:00:00.000Z');
    verifyNoBanner();
    checkForResults();

    cy.axeCheck();
  });

  it('should NOT display maintenance message when 0 results on Monday at 2 PM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-15T18:00:00.000Z');
    verifyNoBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should NOT display maintenance message when 0 results on Saturday at 6 PM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-20T22:00:00.000Z');
    verifyNoBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should NOT display maintenance message when 0 results on Sunday at 9 AM EST', () => {
    mockResultsEmpty();
    setClockAndSearch('2021-03-21T13:00:00.000Z');
    verifyNoBanner();
    verifyNoResults();

    cy.axeCheck();
  });

  it('should resume normal functionality immediately after maintenance window ends', () => {
    mockResults();
    setClockAndSearch('2021-03-16T23:01:00.000Z');
    verifyNoBanner();
    checkForResults();

    cy.axeCheck();
  });
});
