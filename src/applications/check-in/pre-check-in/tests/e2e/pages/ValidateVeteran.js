import Timeouts from 'platform/testing/e2e/timeouts';

class ValidateVeteran {
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Start pre-check-in');
  }
  validateVeteran(lastName = 'Smith', last4 = '1234') {
    this.typeLastName(lastName);
    this.typeLast4(last4);
  }

  getLastNameInput() {
    return cy
      .get('[label="Your last name"]')
      .shadow()
      .find('input');
  }

  getLast4Input() {
    return cy
      .get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('input');
  }

  typeLastName(lastName = 'Smith') {
    this.getLastNameInput().type(lastName);
  }

  typeLast4(last4 = '1234') {
    this.getLast4Input().type(last4);
  }

  attemptToGoToNextPage() {
    cy.get('[data-testid=check-in-button]').click();
  }
}

export default new ValidateVeteran();
