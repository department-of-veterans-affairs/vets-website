import URLSearchParams from 'url-search-params';

import contract from '../../../../pacts/va.gov_search-va.gov_api.json';

const scenarios = contract.interactions.reduce(
  (acc, cur) => ({
    ...acc,
    [cur.providerState]: cur.response.body,
  }),
  {},
);

describe('Search', () => {
  before(() => {
    cy.server();

    cy.route(
      'GET',
      '/v0/search?query=test1',
      scenarios['no matching results exist'],
    ).as('searchWithNoResults');

    cy.route(
      'GET',
      '/v0/search?query=test2',
      scenarios['multiple matching results exist'],
    ).as('searchWithMultipleResults');
  });

  it('searches from the home page', () => {
    cy.visit('http://localhost:3001');

    cy.get('#announcement-root button')
      .first()
      .click();

    cy.contains('Search').click();

    cy.get('#query')
      .type('test1')
      .type('{enter}');

    cy.location().should(({ pathname, search }) => {
      expect(pathname).to.eq('/search/');
      expect(new URLSearchParams(search).get('query')).to.eq('test1');
    });

    cy.get('form.search-box input').should('have.value', 'test1');

    cy.wait('@searchWithNoResults')
      .get('ul.results-list')
      .should('not.exist');

    cy.contains('Search').click();

    cy.get('#query')
      .type('test2')
      .type('{enter}');

    cy.wait('@searchWithMultipleResults')
      .get('ul.results-list')
      .should('exist');
  });
});
