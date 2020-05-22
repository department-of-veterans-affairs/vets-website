/**
 * Fills the address form elements.
 *
 * @param {string} baseName The start of the field name for the address elements
 * @param {object} address The address object
 */
Cypress.Commands.add('fillAddress', (baseName, address) => {
  if (address.country) {
    cy.get(`select[name="${baseName}_country"]`).select(address.country);
  }

  if (address.street) {
    cy.get(`input[name="${baseName}_street"]`).type(address.street);
  }

  if (address.street2) {
    cy.get(`input[name="${baseName}_street2"]`).type(address.street2);
  }

  if (address.city) {
    cy.get(`input[name="${baseName}_city"]`).type(address.city);
  }

  if (address.state) {
    cy.get(`select[name="${baseName}_state"]`).select(address.state);
  }

  if (address.postalCode) {
    cy.get(`input[name="${baseName}_postalCode"]`).type(address.postalCode);
  }
});
