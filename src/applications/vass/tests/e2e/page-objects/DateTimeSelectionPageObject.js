import PageObject from './PageObject';

export class DateTimeSelectionPageObject extends PageObject {
  /**
   * Assert the Date Time Selection page is displayed
   * @returns {DateTimeSelectionPageObject}
   */
  assertDateTimeSelectionPage() {
    this.assertHeading({
      name: 'When do you want to schedule your appointment?(*Required)',
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertWrapperErrorAlert({ exist: false });

    this.assertElement('date-time-selection', { exist: true });
    this.assertElement('content', { exist: true });
    this.assertCalendarWidget();
    this.assertContinueButton();

    this.assertContentText();
    this.assertCalendarWidget();
    cy.findByText(/Appointment times are displayed in/i).should('exist');
    cy.findByText(
      /You can schedule a appointment on a week day within the next 2 weeks\./i,
    ).should('exist');

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the page content text is displayed
   * @returns {DateTimeSelectionPageObject}
   */
  assertContentText() {
    this.assertElement('content', {
      containsText: 'Select an available date and time from the calendar below',
    });
    return this;
  }

  /**
   * Assert the calendar widget is displayed
   * @returns {DateTimeSelectionPageObject}
   */
  assertCalendarWidget() {
    this.assertElement('vaos-calendar', { exist: true });
    return this;
  }

  /**
   * Assert the validation error message is displayed
   * @param {string} errorMessage - The expected error message
   * @returns {DateTimeSelectionPageObject}
   */
  assertValidationError(errorMessage) {
    cy.get('.vaos-calendar__validation-msg')
      .should('exist')
      .and('contain.text', errorMessage);
    return this;
  }

  /**
   * Assert no validation error is displayed
   * @returns {DateTimeSelectionPageObject}
   */
  assertNoValidationError() {
    cy.get('.vaos-calendar__validation-msg').should('not.exist');
    return this;
  }

  /**
   * Select the first available date on the calendar
   * @returns {DateTimeSelectionPageObject}
   */
  selectFirstAvailableDate() {
    cy.findByTestId('vaos-calendar').within(() => {
      cy.findAllByRole('button')
        .not('[disabled]')
        .not('.usa-button-disabled')
        .first()
        .click();
    });
    return this;
  }

  /**
   * Select the first available time slot
   * @returns {DateTimeSelectionPageObject}
   */
  selectFirstAvailableTimeSlot() {
    cy.get('.vaos-calendar__option-cell input[type="radio"]:not([disabled])')
      .first()
      .click({ force: true });
    return this;
  }

  /**
   * Select a time slot by index (0-based). Use after a date is already selected.
   * Consistent with VAOS referral flow: select by index for deterministic tests.
   * @param {number} index - Index of the time slot to select (0-based)
   * @returns {DateTimeSelectionPageObject}
   */
  selectTimeSlotByIndex(index = 0) {
    cy.get('.vaos-calendar__option-cell input[type="radio"]:not([disabled])')
      .eq(index)
      .click({ force: true });
    return this;
  }

  /**
   * Click the continue button
   * @returns {DateTimeSelectionPageObject}
   */
  clickContinue() {
    cy.findByTestId('continue-button')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Assert the continue button exists
   * @returns {DateTimeSelectionPageObject}
   */
  assertContinueButton() {
    this.assertElement('continue-button', { exist: true });
    return this;
  }

  /**
   * Navigate to the next month on the calendar
   * @returns {DateTimeSelectionPageObject}
   */
  goToNextMonth() {
    cy.get('.vaos-calendar__nav-links button')
      .last()
      .click();
    return this;
  }

  /**
   * Navigate to the previous month on the calendar
   * @returns {DateTimeSelectionPageObject}
   */
  goToPreviousMonth() {
    cy.get('.vaos-calendar__nav-links button')
      .first()
      .click();
    return this;
  }

  /**
   * Assert a specific date is available (not disabled)
   * @param {string} date - The date to check
   * @returns {DateTimeSelectionPageObject}
   */
  assertDateAvailable(date) {
    cy.get(`[data-date="${date}"]`).should('not.be.disabled');
    return this;
  }

  /**
   * Assert a specific date is unavailable (disabled)
   * @param {string} date - The date to check
   * @returns {DateTimeSelectionPageObject}
   */
  assertDateUnavailable(date) {
    cy.get(`[data-date="${date}"]`).should('be.disabled');
    return this;
  }

  /**
   * Assert that a time slot is selected
   * @param {string} slotId - The slot identifier
   * @returns {DateTimeSelectionPageObject}
   */
  assertTimeSlotSelected(slotId) {
    cy.get(`[data-value="${slotId}"]`).should('be.checked');
    return this;
  }

  /**
   * Select an available date and time slot, then continue
   * @returns {DateTimeSelectionPageObject}
   */
  selectFirstAvailableDateTimeAndContinue() {
    this.selectFirstAvailableDate();
    this.selectFirstAvailableTimeSlot();
    this.clickContinue();
    return this;
  }

  /**
   * Submit form without selecting any date/time to trigger validation errors
   * @returns {DateTimeSelectionPageObject}
   */
  submitWithoutSelection() {
    this.clickContinue();
    return this;
  }

  /**
   * Assert the timezone text is displayed
   * @param {string} timezone - The expected timezone description
   * @returns {DateTimeSelectionPageObject}
   */
  assertTimezoneText(timezone) {
    cy.findByTestId('content')
      .should('exist')
      .and('contain.text', timezone);
    return this;
  }

  /**
   * Selects an appointment slot by index
   * @param {number} index - Index of the slot to select (0-based)
   */
  selectAppointmentSlot(index = 0) {
    const buttonIndex = index + 1; // Add one for the Prev button
    cy.findByTestId('cal-widget').within(() => {
      // Check that we are on the next month
      cy.findByLabelText(/Prev/i).should('not.be.disabled');

      // Find active buttons and click the specified one
      cy.findAllByRole('button')
        .not('[disabled]')
        .not('.usa-button-disabled')
        .eq(buttonIndex)
        .click();
      // Verify that at least one radio button with time information is present
      cy.findAllByRole('radio')
        .eq(0)
        .click();
    });
    return this;
  }

  /**
   * Validates that appointment slots are displayed
   * @param {Object} options - Options for assertion
   * @param {number} options.count - Expected number of active appointment slots
   */
  assertAppointmentSlots(count = 3) {
    const buttonCount = count + 1; // Add one for the Prev button
    cy.findByTestId('cal-widget')
      .should('exist')
      .within(() => {
        // Check that we are on the next month
        cy.findByLabelText(/Prev/i).should('not.be.disabled');

        // Find buttons that are not disabled (active slots)
        cy.findAllByRole('button')
          .not('[disabled]')
          .not('.usa-button-disabled')
          .should('have.length', buttonCount);
      });
    return this;
  }
}

export default new DateTimeSelectionPageObject();
