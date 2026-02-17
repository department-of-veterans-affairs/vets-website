import Timeouts from 'platform/testing/e2e/timeouts';

const messages = {
  title: {
    dayOf: {
      en: 'Start checking in for your appointment',
      es: 'Start checking in for your appointment',
      tl: 'Start checking in for your appointment',
    },
    preCheckIn: {
      en: 'Check if your information is up to date',
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
    travelClaim: () => {
      cy.get('[data-testid="travelClaim-validate-page"]').should('be.visible');
      cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    },
  };

  validateVeteran = (
    lastName = 'Smith',
    year = '1935',
    month = '04',
    day = '07',
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

  validateVeteranIncorrect = (
    lastName = 'Sith',
    year = '1988',
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
    year = '89',
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

  getMonthInput = () => {
    return cy
      .get('[label="Date of birth"]')
      .shadow()
      .find('.usa-form-group--month-input')
      .shadow()
      .find('[name="date-of-birthMonth"]');
  };

  getDayInput = () => {
    return cy
      .get('[label="Date of birth"]')
      .shadow()
      .find('.usa-form-group--day-input')
      .shadow()
      .find('[name="date-of-birthDay"]');
  };

  getYearInput = () => {
    return cy
      .get('[label="Date of birth"]')
      .shadow()
      .find('.usa-form-group--year-input')
      .shadow()
      .find('[name="date-of-birthYear"]');
  };

  typeLastName = (lastName = 'Smith') => {
    this.getLastNameInput().type(lastName);
  };

  typeYear = (year = '1935') => {
    this.getYearInput().type(year);
  };

  typeMonth = (month = '04') => {
    this.getMonthInput().type(month);
  };

  typeDay = (day = '07') => {
    this.getDayInput().type(day);
  };

  clearLastName() {
    this.getLastNameInput().invoke('val', '');
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
    cy.get('[data-testid=check-in-button]').click({
      waitForAnimations: true,
    });
  };

  attemptToGoToNextPageWithEnterKey = () => {
    cy.get('[data-testid=check-in-button]').type('{enter}');
  };

  validateAutocorrectDisabled = () => {
    cy.get('[label="Your last name"]')
      .should('have.attr', 'auto-correct', 'false')
      .should('have.attr', 'spell-check', 'false');
  };

  getLastNameError = () => {
    cy.get('[label="Your last name"]')
      .shadow()
      .find('#input-error-message')
      .contains('Please enter your last name.');
  };

  getDobError = () => {
    cy.get('[label="Date of birth"]')
      .shadow()
      .find('#error-message');
  };

  validateErrorAlert = () => {
    const messageText =
      'We’re sorry. We couldn’t find an account that matches that last name or date of birth. Please try again.';
    cy.get('[data-testid=validate-error-alert]')
      .should('be.visible')
      .and('contain.text', messageText);
  };
}

export default new ValidateVeteran();
