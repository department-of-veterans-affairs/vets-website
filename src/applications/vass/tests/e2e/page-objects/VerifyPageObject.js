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
    this.assertElement('verify-intro-text', {
      containsText:
        'we’ll need your information so we can send you a one-time verification code',
    });

    // Assert form inputs exist
    this.assertElement('last-name-input', { exist: true });
    this.assertElement('dob-input', { exist: true });

    // Assert submit button exists and is in correct initial state
    cy.findByTestId('submit-button')
      .should('exist')
      .and('have.attr', 'loading', 'false')
      .and('not.have.attr', 'disabled');

    // Assert no error states on initial load
    this.assertInvalidCredentialsErrorAlert({ exist: false });
    this.assertInvalidVerificationErrorAlert({ exist: false });

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the invalid credentials error alert is displayed
   * @param {Object} options - Options
   * @param {boolean} options.exist - Whether the alert should exist
   * @returns {VerifyPageObject}
   */
  assertInvalidCredentialsErrorAlert({ exist = true } = {}) {
    this.assertElement('verify-error-alert', {
      exist,
      containsText: exist
        ? 'We’re sorry. We couldn’t find a record that matches that last name or date of birth. Please try again.'
        : undefined,
    });
    return this;
  }

  /**
   * Assert the verification error alert is displayed
   * @param {Object} options - Options
   * @param {boolean} options.exist - Whether the alert should exist
   * @returns {VerifyPageObject}
   */
  assertInvalidVerificationErrorAlert({ exist = true } = {}) {
    if (exist) {
      this.assertVerificationErrorAlert({
        headingText: 'We couldn’t verify your information',
        containsText:
          'We’re sorry. We couldn’t match your information to your records. Please call us for help.',
      });
    } else {
      this.assertVerificationErrorAlert({ exist: false });
    }
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
   * Enter a default last name for testing
   * @returns {VerifyPageObject}
   */
  enterDefaultLastName() {
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
   * Enter a default date of birth for testing
   * @returns {VerifyPageObject}
   */
  enterDefaultDateOfBirth() {
    return this.enterDateOfBirth('1935-04-07');
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
   * Fill the form with default data and submit
   * @returns {VerifyPageObject}
   */
  fillAndSubmitDefaultForm() {
    this.enterDefaultLastName();
    this.enterDefaultDateOfBirth();
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
