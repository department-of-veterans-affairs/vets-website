export const fillVaFacilitySearch = () => {
  cy.get('va-search-input')
    .shadow()
    .find('input')
    .type('43231');
  cy.realPress('Enter');

  cy.wait('@getFacilities');

  cy.get('#root_facility_search_list')
    .should('be.visible')
    .first()
    .click();
};

export const fillStatementOfTruthPattern = (label, signature) => {
  cy.findByTestId(label)
    .find('.signature-input')
    .then($el => cy.fillVaTextInput($el, signature));

  cy.findByTestId(label)
    .find('.signature-checkbox')
    .then($el => cy.selectVaCheckbox($el, true));
};
