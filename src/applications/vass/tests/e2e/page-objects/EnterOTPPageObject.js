import PageObject from './PageObject';

export class EnterOTPPageObject extends PageObject {
  /**
   * Assert the Enter OTP page is displayed with scheduling flow heading
   * @returns {EnterOTPPageObject}
   */
  assertEnterOTPPage({ cancellationFlow = false } = {}) {
    const headingText = cancellationFlow
      ? 'Cancel VA Solid Start appointment'
      : 'Schedule an appointment with VA Solid Start';

    this.assertHeading({
      name: headingText,
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertWrapperErrorAlert({ exist: false });

    this.assertElement('otp-input', { exist: true });
    this.assertElement('continue-button', { exist: true });
    this.assertElement('enter-otp-success-alert', { exist: true });
    this.assertSuccessAlert({ exist: true });

    // Assert no error states on initial load
    this.assertOTPErrorAlert({ exist: false });
    this.assertVerificationErrorAlert({ exist: false });

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the verification error page is displayed (account locked)
   * @returns {EnterOTPPageObject}
   */
  assertVerificationErrorPage({ exist = true } = {}) {
    if (exist) {
      this.assertVerificationErrorAlert({
        headingText: /We couldn.t verify your information/i,
        contain: /The one-time verification code you entered doesn’t match the one we sent you. You can try again in 15 minutes. Check your email and select the link to schedule a call./i,
      });
    } else {
      this.assertVerificationErrorAlert({ exist: false });
    }
    return this;
  }

  /**
   * Enter an OTP code value
   * @param {string} code - The OTP code to enter
   * @returns {EnterOTPPageObject}
   */
  enterOTP(code) {
    cy.fillVaTextInput('otp', code);
    return this;
  }

  /**
   * Enter a default OTP code for testing
   * @returns {EnterOTPPageObject}
   */
  enterDefaultOTP() {
    return this.enterOTP('123456');
  }

  /**
   * Click the continue button
   * @returns {EnterOTPPageObject}
   */
  clickContinue() {
    cy.findByTestId('continue-button')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Assert the success alert is displayed or not
   * @param {Object} props - Options
   * @param {boolean} props.exist - Whether the alert should exist
   * @returns {EnterOTPPageObject}
   */
  assertSuccessAlert({ exist = true } = {}) {
    this.assertElement('enter-otp-success-alert', { exist });
    return this;
  }

  /**
   * Assert the error alert is displayed or not
   * @param {Object} props - Options
   * @param {boolean} props.exist - Whether the alert should exist
   * @param {string|RegExp} props.contain - The text of the alert to assert
   * @returns {EnterOTPPageObject}
   */
  assertOTPErrorAlert({ exist = true, contain } = {}) {
    this.assertElement('enter-otp-error-alert', { exist, contain });
    return this;
  }

  /**
   * Assert the OTP input has an error
   * @param {string} errorMessage - The expected error message
   * @returns {EnterOTPPageObject}
   */
  assertOTPError(errorMessage) {
    cy.findByTestId('otp-input').should('have.attr', 'error', errorMessage);
    return this;
  }

  /**
   * Assert the OTP input has no error
   * @returns {EnterOTPPageObject}
   */
  assertNoOTPError() {
    cy.findByTestId('otp-input').should('not.have.attr', 'error');
    return this;
  }

  /**
   * Assert the success alert contains the obfuscated email
   * @param {string} email - The obfuscated email to check for
   * @returns {EnterOTPPageObject}
   */
  assertSuccessAlertContainsEmail(email) {
    this.assertElement('enter-otp-success-alert', {
      containsText: email,
    });
    return this;
  }

  /**
   * Fill the form with default OTP and submit
   * @returns {EnterOTPPageObject}
   */
  fillAndSubmitDefaultOTP() {
    this.enterDefaultOTP();
    this.clickContinue();
    return this;
  }

  /**
   * Fill the form with custom OTP and submit
   * @param {string} code - The OTP code to enter
   * @returns {EnterOTPPageObject}
   */
  fillAndSubmitOTP(code) {
    this.enterOTP(code);
    this.clickContinue();
    return this;
  }

  /**
   * Submit form without entering any data to trigger validation errors
   * @returns {EnterOTPPageObject}
   */
  submitEmptyForm() {
    this.clickContinue();
    return this;
  }
}

export default new EnterOTPPageObject();
