describe('Facility Locator', () => {
  it('searches and navigates to a facility page', () => {
    cy.visit('http://localhost:3001/find-locations');

    cy.get('input[name=street-city-state-zip')
      .type('Seattle, WA')
      .type('{enter}');

    cy.get('.facility-result a')
      .first()
      .click();
  });
});
