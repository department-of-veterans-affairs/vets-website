/**
 * Fills in a date.
 *
 * @param {String} fieldName The name the field without the Month, Day, or Year
 *                           e.g. root_spouseInfo_remarriageDate
 * @param {String} dateString The date as a string
 *                            e.g. 1990-1-28
 */
Cypress.Commands.add('fillDate', (fieldName, dateString) => {
  const date = dateString.split('-');
  cy.get(`#${fieldName}Month`)
    .select(parseInt(date[1], 10).toString())
    .should('have.value', parseInt(date[1], 10).toString());

  cy.get(`#${fieldName}Day`)
    .select(parseInt(date[2], 10).toString())
    .should('have.value', parseInt(date[2], 10).toString());

  cy.get(`#${fieldName}Year`).type(parseInt(date[0], 10).toString());
});
