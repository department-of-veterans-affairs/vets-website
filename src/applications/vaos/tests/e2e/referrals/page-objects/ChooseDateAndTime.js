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
    cy.findByText(/You or your referring VA facility selected/).should('exist');
    cy.findByText(/Dr. Bones/).should('exist');
    cy.findByText(/Meridian Health/).should('exist');

    return this;
  }

  /**
   * Validates that appointment slots are displayed
   * @param {Object} options - Options for assertion
   * @param {number} options.count - Expected number of active appointment slots
   */
  assertAppointmentSlots({ count = 3 } = {}) {
    cy.findByTestId('cal-widget')
      .should('exist')
      .within(() => {
        // Find buttons that are not disabled (active slots)
        cy.findAllByRole('button')
          .not('[disabled]')
          .not('.usa-button-disabled')
          .should('have.length', count);
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
  assertNoSlotsAvailable() {
    cy.findByTestId('no-slots-alert').should('exist');
    cy.findByText(/We're sorry. We couldn't find any open time slots/).should(
      'exist',
    );
    return this;
  }

  /**
   * Selects an appointment slot by index
   * @param {number} index - Index of the slot to select (0-based)
   */
  selectAppointmentSlot(index = 0) {
    cy.findByTestId('cal-widget').within(() => {
      // Find active buttons and click the specified one
      cy.findAllByRole('button')
        .not('[disabled]')
        .not('.usa-button-disabled')
        .eq(index)
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
