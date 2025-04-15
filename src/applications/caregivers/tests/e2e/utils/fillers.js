export const fillVaFacilitySearch = () => {
  cy.get('va-search-input')
    .shadow()
    .find('input')
    .type('43231{enter}');

  cy.wait(['@getCoordinates', '@getFacilities']);

  cy.get('#root_facility_search_list')
    .should('be.visible')
    .first()
    .click();
};

export const fillStatementOfTruthPattern = (label, signature) => {
  cy.findByTestId(label).within(() => {
    cy.get('.signature-input').then($el => cy.fillVaTextInput($el, signature));
    cy.get('.signature-checkbox').then($el => cy.selectVaCheckbox($el, true));
  });
};
