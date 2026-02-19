import PageObject from './PageObject';

export class VerifyPageObject extends PageObject {
  /**
   * Assert the Verify page is displayed with all elements in correct initial state
   * @param {Object} options - Options
   * @param {boolean} options.cancellationFlow - Whether this is the cancellation flow
   * @returns {VerifyPageObject}
   */
  assertVerifyPage({ cancellationFlow = false } = {}) {
    // Assert correct heading based on flow
    const headingText = cancellationFlow
      ? 'Cancel VA Solid Start appointment'
      : 'Schedule an appointment with VA Solid Start';

    this.assertHeading({
      name: headingText,
      level: 1,
      exist: true,
    });

    // Assert intro text is displayed with correct content
    cy.findByTestId('verify-intro-text')
      .should('exist')
      .and(
        'contain.text',
        'we’ll need your information so we can send you a one-time verification code',
      );

    // Assert form inputs exist
    this.assertElement('last-name-input', { exist: true });
    this.assertElement('dob-input', { exist: true });

    // Assert submit button exists and is in correct initial state
    cy.findByTestId('submit-button')
      .should('exist')
      .and('have.attr', 'loading', 'false')
      .and('not.have.attr', 'disabled');

    // Assert no error states on initial load
    this.assertVerifyErrorAlert({ exist: false });

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the verification error page is displayed
   * @returns {VerifyPageObject}
   */
  assertVerificationErrorPage() {
    this.assertHeading({
      name: /We couldn.t verify your information/i,
      level: 1,
      exist: true,
    });
    return this;
  }

  /**
   * Assert the error alert is displayed
   * @returns {VerifyPageObject}
   */
  assertVerifyErrorAlert({ exist = true } = {}) {
    this.assertElement('verify-error-alert', { exist });
    return this;
  }

  /**
   * Assert the last name input has an error
   * @param {string} errorMessage - The expected error message
   * @returns {VerifyPageObject}
   */
  assertLastNameError(errorMessage) {
    cy.findByTestId('last-name-input').should(
      'have.attr',
      'error',
      errorMessage,
    );
    return this;
  }

  /**
   * Assert the date of birth input has an error
   * @param {string} errorMessage - The expected error message
   * @returns {VerifyPageObject}
   */
  assertDateOfBirthError(errorMessage) {
    cy.findByTestId('dob-input').should('have.attr', 'error', errorMessage);
    return this;
  }

  /**
   * Enter a last name value
   * @param {string} lastName - The last name to enter
   * @returns {VerifyPageObject}
   */
  enterLastName(lastName) {
    cy.fillVaTextInput('last-name', lastName);
    return this;
  }

  /**
   * Enter a valid last name for testing
   * @returns {VerifyPageObject}
   */
  enterValidLastName() {
    return this.enterLastName('Smith');
  }

  /**
   * Enter a date of birth using the VaMemorableDate component.
   * Uses standard Cypress .type() instead of cy.fillVaMemorableDate() because
   * the platform command uses cy.realType() (from cypress-real-events) in Chrome,
   * which hangs indefinitely in headless Chrome inside Docker CI containers.
   * @param {string} dateString - Date in YYYY-MM-DD format (e.g., '1990-01-15')
   * @returns {VerifyPageObject}
   */
  enterDateOfBirth(dateString) {
    const [year, month, day] = dateString
      .split('-')
      .map(
        dateComponent =>
          Number.isFinite(dateComponent)
            ? parseInt(dateComponent, 10).toString()
            : dateComponent,
      );

    const getSelectors = type =>
      `va-text-input.input-${type}, va-text-input.usa-form-group--${type}-input`;

    cy.get('va-memorable-date[name="date-of-birth"]')
      .shadow()
      .then(el => {
        cy.wrap(el)
          .find(getSelectors('month'))
          .shadow()
          .find('input')
          .type(`{selectall}{del}${month}`, { force: true });

        cy.wrap(el)
          .find(getSelectors('day'))
          .shadow()
          .find('input')
          .type(`{selectall}{del}${day}`, { force: true });

        cy.wrap(el)
          .find(getSelectors('year'))
          .shadow()
          .find('input')
          .type(`{selectall}{del}${year}`, { force: true });
      });

    return this;
  }

  /**
   * Enter a valid date of birth for testing
   * @returns {VerifyPageObject}
   */
  enterValidDateOfBirth() {
    return this.enterDateOfBirth('1990-01-15');
  }

  /**
   * Click the submit button
   * @returns {VerifyPageObject}
   */
  clickSubmit() {
    cy.findByTestId('submit-button')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Fill the form with valid data and submit
   * @returns {VerifyPageObject}
   */
  fillAndSubmitValidForm() {
    this.enterValidLastName();
    this.enterValidDateOfBirth();
    this.clickSubmit();
    return this;
  }

  /**
   * Fill the form with custom data and submit
   * @param {Object} props - Form data
   * @param {string} props.lastName - Last name to enter
   * @param {string} props.dateOfBirth - Date of birth in YYYY-MM-DD format
   * @returns {VerifyPageObject}
   */
  fillAndSubmitForm({ lastName, dateOfBirth }) {
    this.enterLastName(lastName);
    this.enterDateOfBirth(dateOfBirth);
    this.clickSubmit();
    return this;
  }
}

export default new VerifyPageObject();
