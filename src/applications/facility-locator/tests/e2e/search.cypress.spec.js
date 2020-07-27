describe('Facility Search', () => {
  it('displays search results header after searching', () => {
    cy.visit(
      '/find-locations/?address=new%20york&context=New%20York%2C%20New%20York%2C%20United%20States&facilityType=health&location=40.7648%2C-73.9808',
    );

    cy.get('#facility-search-results').should('exist');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('does not show search result header if no results are found', () => {
    cy.visit('/find-locations?fail=true');
    cy.get('#facility-search-results').should('not.exist');
    cy.injectAxe();
    cy.axeCheck();
  });
});
