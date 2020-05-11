/**
 * Selects the appropriate option for yesNo widgets.
 *
 * @param {string} fieldName The name of the field without Yes or No
 *                           e.g. root_spouseInfo_divorcePending
 * @param {bool} condition Determines whether to select Yes or No
 */
Cypress.Commands.add('selectYesNo', (fieldName, condition) => {
  cy.get(`#${fieldName}${condition ? 'Yes' : 'No'}`).click();
});
