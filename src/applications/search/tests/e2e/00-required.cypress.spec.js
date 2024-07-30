import stub from '../../constants/stub.json';
// import zeroResultsStub from '../../constants/stubZeroResults.json';
import { SELECTORS as s } from './helpers';

describe('Global search', () => {
  const verifyLink = (text, href) => {
    cy.get(`${s.SEARCH_RESULTS} li va-link[text="${text}"]`).should(
      'be.visible',
    );
    cy.get(`${s.SEARCH_RESULTS} li va-link[href*="${href}"]`).should(
      'be.visible',
    );
  };

  it('successfully searches and renders results', () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: stub,
      statusCode: 200,
    });

    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      verifyLink(
        'Veterans Benefits Administration Home',
        'https://benefits.va.gov/benefits/',
      );
      verifyLink('Download VA benefit letters', '/download-va-letters/');
      verifyLink(
        'VA benefits for spouses, dependents, survivors, and family caregivers',
        '/family-member-benefits/',
      );
    });

    cy.axeCheck();
  });

  it('successfully searches and renders results from the results page', () => {
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    });

    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');

      cy.get(s.SEARCH_INPUT).focus();
      cy.get(s.SEARCH_INPUT).clear();
      cy.get(s.SEARCH_INPUT).type('benefits');
      cy.get(s.SEARCH_BUTTON).click();
      verifyLink(
        'Veterans Benefits Administration Home',
        'https://benefits.va.gov/benefits/',
      );
      verifyLink('Download VA benefit letters', '/download-va-letters/');
      verifyLink(
        'VA benefits for spouses, dependents, survivors, and family caregivers',
        '/family-member-benefits/',
      );
    });

    cy.axeCheck();
  });

  it('fails to search and has an error', () => {
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: [],
      statusCode: 500,
    });

    cy.visit('/search/?query=benefits');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON).should('be.visible');
      cy.get(`${s.ERROR_ALERT_BOX} h2`)
        .should('be.visible')
        .should('have.text', 'Your search didn’t go through');
    });

    cy.axeCheck();
  });

  // TODO add typeahead tests from the search page
});
