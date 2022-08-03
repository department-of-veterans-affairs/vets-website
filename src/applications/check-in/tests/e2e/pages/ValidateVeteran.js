import Timeouts from 'platform/testing/e2e/timeouts';

const messages = {
  title: {
    dayOf: {
      en: 'Check in at VA',
      es: 'Regístrese en VA',
    },
    preCheckIn: {
      en: 'Start pre-check-in',
    },
  },
};

class ValidateVeteran {
  validatePageLoaded = title => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', title);
  };

  validatePage = {
    dayOf: (language = 'en') => {
      this.validatePageLoaded(messages.title.dayOf[language]);
    },
    preCheckIn: (language = 'en') => {
      this.validatePageLoaded(messages.title.preCheckIn[language]);
    },
  };

  validateVeteran = (lastName = 'Smith', last4 = '1234') => {
    this.clearLastName();
    this.typeLastName(lastName);
    this.clearLast4();
    this.typeLast4(last4);
  };

  validateVeteranDob = (
    lastName = 'Smith',
    year = '1989',
    month = '03',
    day = '15',
  ) => {
    this.clearLastName();
    this.typeLastName(lastName);
    this.clearYear();
    this.typeYear(year);
    this.clearMonth();
    this.typeMonth(month);
    this.clearDay();
    this.typeDay(day);
  };

  validateVeteranDobInvalidYear = (
    lastName = 'Smith',
    year = '2050',
    month = '01',
    day = '31',
  ) => {
    this.clearLastName();
    this.typeLastName(lastName);
    this.clearMonth();
    this.typeMonth(month);
    this.clearDay();
    this.typeDay(day);
    this.clearYear();
    this.typeYear(year);
  };

  validateVeteranDobWithFailure = (
    lastName = 'Smith',
    year = '1988',
    month = '01',
    day = '31',
  ) => {
    this.clearLastName();
    this.typeLastName(lastName);
    this.clearMonth();
    this.typeMonth(month);
    this.clearDay();
    this.typeDay(day);
    this.clearYear();
    this.typeYear(year);
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

  getMonthInput = () => {
    return cy
      .get('[label="Date of birth"]')
      .shadow()
      .find('.input-month')
      .shadow()
      .find('[name="date-of-birthMonth"]');
  };

  getDayInput = () => {
    return cy
      .get('[label="Date of birth"]')
      .shadow()
      .find('.input-day')
      .shadow()
      .find('[name="date-of-birthDay"]');
  };

  getYearInput = () => {
    return cy
      .get('[label="Date of birth"]')
      .shadow()
      .find('.input-year')
      .shadow()
      .find('[name="date-of-birthYear"]');
  };

  typeLastName = (lastName = 'Smith') => {
    this.getLastNameInput().type(lastName);
  };

  typeLast4 = (last4 = '1234') => {
    this.getLast4Input().type(last4);
  };

  typeYear = (year = '1989') => {
    this.getYearInput().type(year);
  };

  typeMonth = (month = '03') => {
    this.getMonthInput().type(month);
  };

  typeDay = (day = '15') => {
    this.getDayInput().type(day);
  };

  clearLastName() {
    this.getLastNameInput().invoke('val', '');
  }

  clearLast4() {
    this.getLast4Input().invoke('val', '');
  }

  clearDay() {
    this.getDayInput().invoke('val', '');
  }

  clearMonth() {
    this.getMonthInput().invoke('val', '');
  }

  clearYear() {
    this.getYearInput().invoke('val', '');
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

  getDobError = () => {
    cy.get('[label="Date of birth"]')
      .shadow()
      .find('.error-message')
      .contains('Your date of birth can not be in the future');
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

  validateErrorAlert = (withLorotaSecurityUpdate = false) => {
    const messageText = withLorotaSecurityUpdate
      ? 'Sorry, we couldn’t find an account that matches that last name or date of birth. Please try again.'
      : 'We’re sorry. We couldn’t match your information to our records. Please try again.';
    cy.get('[data-testid=validate-error-alert]')
      .should('be.visible')
      .and('have.text', messageText);
  };
}

export default new ValidateVeteran();
