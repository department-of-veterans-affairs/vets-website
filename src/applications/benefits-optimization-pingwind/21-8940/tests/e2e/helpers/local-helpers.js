export const fillNumberWebComponent = (fieldName, value) => {
  if (typeof value === 'undefined') return;

  const stringValue = value.toString();
  const selector = `va-text-input[name="root_${fieldName}"], va-number-input[name="root_${fieldName}"]`;
  // numberUI currently renders va-text-input; keep va-number-input for legacy pages

  cy.get(selector)
    .first()
    .shadow()
    .find('input')
    .as('numberInput');

  cy.get('@numberInput').clear({ force: true, delay: 100 });

  if (stringValue !== '') {
    cy.get('@numberInput').type(stringValue, { force: true });
  }

  cy.get('@numberInput').should('have.value', stringValue);
};
