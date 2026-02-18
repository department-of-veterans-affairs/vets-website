import PageObject from '../../page-objects/PageObject';

export class ChooseDateAndTimePageObject extends PageObject {
  /**
   * Validates that we're on the Choose Date and Time page
   */
  validate() {
    // Check for the header
    cy.findByRole('heading', {
      level: 1,
      name: 'Schedule an appointment with your provider',
    }).should('exist');

    // Check for other key elements
    cy.findByText(/Choose a date and time/).should('exist');
    cy.findByTestId('cal-widget').should('exist');

    return this;
  }

  /**
   * Validates provider information is displayed correctly
   */
  assertProviderInfo() {
    // Verify provider information
    cy.findByText(/You or your VA facility chose this/).should('exist');
    cy.findByText(/Dr. Moreen S. Rafa/).should('exist');
    cy.findByText(/Meridian Health/).should('exist');
    cy.findByText(
      /Appointment times are displayed in (Eastern time \(ET\))/,
    ).should('exist');
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

  /**
   * Validates that an API error message is displayed when draft referral appointment fails to load
   */
  assertApiError() {
    // This uses curly apostrophes as required by VA style guidelines
    cy.findByText(/We’re sorry. We’ve run into a problem/i).should('exist');
    return this;
  }

  /**
   * Validates that no slots available warning is shown
   */
  assertNoSlotsAvailableAlert() {
    cy.findByTestId('no-slots-alert').within(() => {
      cy.findByText(/We couldn’t find any open time slots./).should('exist');
      cy.findByText(
        /Call this provider or your facility’s community care office to schedule an appointment./,
      ).should('exist');
      cy.findByTestId('referral-community-care-office').should('exist');
    });
    return this;
  }

  /**
   * Selects the next month
   */
  selectNextMonth() {
    cy.findByLabelText(/Next/i).click();
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
   * Clicks the Continue button to proceed
   */
  clickContinue() {
    return this.clickNextButton();
  }

  /**
   * Clicks the Back button
   */
  clickBack() {
    return this.clickBackButton();
  }

  /**
   * Validates that the station ID not valid alert is displayed
   */
  assertStationIdNotValidAlert() {
    cy.findByTestId('station-id-not-valid-alert').within(() => {
      cy.findByText(/Online scheduling isn’t available right now/).should(
        'exist',
      );
      cy.findByText(
        /Call this provider or your facility’s community care office to schedule an appointment./,
      ).should('exist');
      cy.findByTestId('referral-community-care-office').should('exist');
    });
    return this;
  }

  /**
   * Validates the URL for the page
   */
  _validateUrl() {
    cy.url().should('include', '/schedule-appointment');
    return this;
  }

  /**
   * Validates the header for the page
   */
  _validateHeader() {
    cy.findByRole('heading', {
      level: 1,
      name: 'Schedule an appointment with your provider',
    }).should('exist');
    return this;
  }
}

export default new ChooseDateAndTimePageObject();
