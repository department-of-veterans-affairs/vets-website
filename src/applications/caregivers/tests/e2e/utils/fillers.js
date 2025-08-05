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
