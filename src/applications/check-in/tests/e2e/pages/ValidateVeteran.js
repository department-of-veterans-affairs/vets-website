import Timeouts from 'platform/testing/e2e/timeouts';

class ValidateVeteran {
  validatePageLoaded = (title = 'Start pre-check-in') => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', title);
  };

  validatePage = {
    dayOf: () => {
      this.validatePageLoaded('Check in at VA');
    },
    preCheckIn: () => {
      this.validatePageLoaded('Start pre-check-in');
    },
  };

  validateVeteran = (lastName = 'Smith', last4 = '1234') => {
    this.typeLastName(lastName);
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
}

export default new ValidateVeteran();
