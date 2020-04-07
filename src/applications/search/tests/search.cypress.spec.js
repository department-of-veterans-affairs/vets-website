import URLSearchParams from 'url-search-params';

describe('Search', () => {
  it('searches from the home page', () => {
    cy.visit('http://localhost:3001');

    cy.get('#announcement-root button')
      .first()
      .click();

    cy.contains('Search').click();

    cy.get('#query')
      .type('test')
      .type('{enter}');

    cy.location().should(({ pathname, search }) => {
      expect(pathname).to.eq('/search/');
      expect(new URLSearchParams(search).get('query')).to.eq('test');
    });

    cy.get('form.search-box input').should('have.value', 'test');
  });
});
