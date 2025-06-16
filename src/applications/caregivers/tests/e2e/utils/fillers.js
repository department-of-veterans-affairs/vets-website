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

export const fillStatementOfTruthPattern = (field, { name, checked } = {}) => {
  const element =
    typeof field === 'string'
      ? cy.get(`va-statement-of-truth[name="${field}"]`)
      : cy.wrap(field);

  element.shadow().within(() => {
    if (name) {
      cy.get('va-text-input').then($el => cy.fillVaTextInput($el, name));
    }
    if (checked) {
      cy.get('va-checkbox').then($el => cy.selectVaCheckbox($el, checked));
    }
  });
};
