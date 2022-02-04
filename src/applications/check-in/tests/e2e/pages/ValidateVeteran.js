import Timeouts from 'platform/testing/e2e/timeouts';

class ValidateVeteran {
  validatePageLoaded = (title = 'Start pre-check-in') => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', title);
  };

  validateVeteran = (lastName = 'Smith', last4 = '1234') => {
    this.clearLastName();
    this.typeLastName(lastName);
    this.clearLast4();
    this.typeLast4(last4);
  };

  getLastNameInput = () => {
    return cy
      .get('[label="Your last name"]')
      .shadow()
      .find('input');
  };

  getLast4Input = () => {
    return cy
      .get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('input');
  };

  typeLastName = (lastName = 'Smith') => {
    this.getLastNameInput().type(lastName);
  };

  typeLast4 = (last4 = '1234') => {
    this.getLast4Input().type(last4);
  };

  clearLastName() {
    this.getLastNameInput().invoke('val', '');
  }

  clearLast4() {
    this.getLast4Input().invoke('val', '');
  }

  attemptToGoToNextPage = () => {
    cy.get('[data-testid=check-in-button]').click({ waitForAnimations: true });
  };

  validateAutocorrectDisabled = () => {
    cy.get('[label="Your last name"]')
      .should('have.attr', 'autocorrect', 'false')
      .should('have.attr', 'spellcheck', 'false');
  };

  getLastNameError = () => {
    cy.get('[label="Your last name"]')
      .shadow()
      .find('#error-message')
      .contains('Please enter your last name.');
  };

  getLast4Error = () => {
    cy.get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('#error-message')
      .contains(
        'Please enter the last 4 digits of your Social Security number',
      );
  };

  validateTypedLast4 = (typed = '1234') => {
    cy.get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('input')
      .should('be.visible')
      .and('have.value', typed);
  };

  validateMax4Text = () => {
    cy.get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('small')
      .should('be.visible')
      .and('have.text', '(Max. 4 characters)');
  };

  validateLast4InputType = () => {
    cy.get('[label="Last 4 digits of your Social Security number"]').should(
      'have.attr',
      'inputmode',
      'numeric',
    );
  };

  validateErrorAlert = (lastAttempt = false) => {
    const errorMessage = lastAttempt
      ? "We're sorry. We couldn't match your information to our records. Please try again or call us at 800-698-2411 (TTY: 711) for help signing in."
      : "Sorry, we couldn't find an account that matches that last name or SSN. Please try again.";
    cy.get('[data-testid=validate-error-alert]')
      .should('be.visible')
      .and('have.text', errorMessage);
  };
}

export default new ValidateVeteran();
