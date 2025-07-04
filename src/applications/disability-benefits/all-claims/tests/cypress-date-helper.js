/**
 * Helper functions for handling date inputs in Cypress tests
 * Specifically designed to work with VA web components
 */

/**
 * Fill a VA web component date field
 * @param {object} cy - Cypress instance
 * @param {string} fieldName - Base name of the date field
 * @param {object} date - Date object with month, day, year
 */
export function fillVADate(cy, fieldName, date) {
  // Handle month select
  if (date.month) {
    cy.get(`select[name="${fieldName}Month"]`)
      .should('exist')
      .select(date.month);
  }

  // Handle day input
  if (date.day) {
    cy.get(`input[name="${fieldName}Day"]`)
      .should('exist')
      .clear();
    cy.get(`input[name="${fieldName}Day"]`).type(date.day);
  }

  // Handle year input
  if (date.year) {
    cy.get(`input[name="${fieldName}Year"]`)
      .should('exist')
      .clear();
    cy.get(`input[name="${fieldName}Year"]`).type(date.year);
  }
}

/**
 * Fill a VA web component date field with shadow DOM
 * @param {object} cy - Cypress instance
 * @param {string} selector - CSS selector for the web component
 * @param {object} date - Date object with month, day, year
 */
export function fillVADateWithShadow(cy, selector, date) {
  // Wait for the component to be ready
  cy.get(selector).should('exist');

  // Handle month select within shadow DOM
  if (date.month) {
    cy.get(selector)
      .shadow()
      .find('select[name*="Month"]')
      .select(date.month);
  }

  // Handle day input within shadow DOM
  if (date.day) {
    cy.get(selector)
      .shadow()
      .find('input[name*="Day"]')
      .clear();
    cy.get(selector)
      .shadow()
      .find('input[name*="Day"]')
      .type(date.day);
  }

  // Handle year input within shadow DOM
  if (date.year) {
    cy.get(selector)
      .shadow()
      .find('input[name*="Year"]')
      .clear();
    cy.get(selector)
      .shadow()
      .find('input[name*="Year"]')
      .type(date.year);
  }
}

/**
 * Wait for VA date component to be fully loaded
 * @param {object} cy - Cypress instance
 * @param {string} fieldName - Base name of the date field
 */
export function waitForVADateComponent(cy, fieldName) {
  cy.get(`select[name="${fieldName}Month"]`).should('be.visible');
  cy.get(`input[name="${fieldName}Day"]`).should('be.visible');
  cy.get(`input[name="${fieldName}Year"]`).should('be.visible');
}
