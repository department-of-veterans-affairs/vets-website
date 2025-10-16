/**
 * Page object for the Referral Appointment Details page
 */
class AppointmentDetails {
  /**
   * Validates that the user is on the appointment details page
   */
  validate() {
    cy.findByText('Community care appointment').should('exist');
    cy.findByTestId('appointment-card').should('exist');
    return this;
  }

  /**
   * Asserts that the provider information is displayed
   * @param {Object} options - Options for the assertion
   * @param {string} options.providerName - Expected provider name
   * @param {string} options.organizationName - Expected organization name
   */
  assertProviderInfo(options = {}) {
    cy.findByRole('heading', { name: 'Provider' }).should('exist');
    if (options.providerName) {
      cy.findByText(options.providerName).should('exist');
    }
    if (options.address) {
      cy.findByText(options.address).should('exist');
    }
    // Check directions link exists
    cy.contains('a', 'Directions').should('exist');
    return this;
  }

  /**
   * Asserts error state is shown correctly
   */
  assertApiError() {
    cy.get('va-alert[status="error"][data-testid="error-alert"]').should(
      'exist',
    );
    cy.contains(
      'Try searching this appointment on your appointment list or call your your facility.',
    ).should('exist');
    return this;
  }

  /**
   * Asserts loading state is shown correctly
   */
  assertLoadingState() {
    cy.findByText('Loading your appointment...').should('exist');
    return this;
  }
}

export default new AppointmentDetails();
