import stub from '../../constants/stub.json';
import { SELECTORS as s } from './helpers';

describe('Error states', () => {
  it('shows an error when no search term is given', () => {
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    });

    cy.visit('/search');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT).should('be.visible');
      cy.get(s.SEARCH_BUTTON)
        .should('be.visible')
        .click();
      cy.get(`${s.ERROR_ALERT_BOX} p`)
        .should('be.visible')
        .should(
          'have.text',
          `Enter a search term that contains letters or numbers to find what you're looking for.`,
        );
    });
  });

  it('shows an error when a very long (255+ chars) search term is given', () => {
    const longSearchString =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eros mi, mattis id mauris non, commodo tempor justo. Nulla suscipit molestie nulla. Curabitur ac pellentesque lectus, id vulputate enim. Fusce vel dui nec urna congue lacinia. In non tempus erose.';
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    });

    cy.visit('/search');
    cy.injectAxeThenAxeCheck();

    cy.get(s.APP).within(() => {
      cy.get(s.SEARCH_INPUT)
        .should('be.visible')
        .type(longSearchString);
      cy.get(s.SEARCH_BUTTON)
        .should('be.visible')
        .click();
      cy.get(`${s.ERROR_ALERT_BOX} p`)
        .should('be.visible')
        .should(
          'have.text',
          'The search is over the character limit. Shorten the search and try again.',
        );
    });
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
});
