import PageObject from '../../page-objects/PageObject';

export class ScheduleReferralPageObject extends PageObject {
  /**
   * Validates that we're on the Schedule Referral page
   */
  validate() {
    // Check for the header with the type of care
    cy.findByRole('heading', { level: 1, name: /Referral for /i }).should(
      'exist',
    );

    return this;
  }

  /**
   * Validates that referral details are displayed correctly
   */
  assertReferralDetails() {
    // Check that the details section exists
    cy.findByRole('heading', {
      level: 2,
      name: 'Details about your referral',
    }).should('exist');

    // Verify that the referral details section is populated
    cy.findByTestId('referral-details')
      .should('exist')
      .and('contain.text', 'Expiration date:')
      .and('contain.text', 'Type of care:')
      .and('contain.text', 'Provider:')
      .and('contain.text', 'Location:')
      .and('contain.text', 'Referral number:');

    return this;
  }

  /**
   * Validates that an API error message is displayed when referral detail fails to load
   */
  assertApiError() {
    // This uses curly apostrophes as required by VA style guidelines
    cy.findByText(/We’re sorry. We’ve run into a problem/i).should('exist');
    return this;
  }

  /**
   * Validates that referring facility information is displayed
   */
  assertreferringFacility() {
    // Verify that the facility information is populated
    cy.findByTestId('referral-facility')
      .should('exist')
      .and('contain.text', 'Referring VA facility:')
      .and('contain.text', 'Phone:');

    return this;
  }

  /**
   * Clicks the Schedule Appointment link
   */
  clickScheduleAppointment() {
    cy.findByText('Schedule your appointment')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Expands the additional info section for users who already scheduled
   */
  expandAlreadyScheduledInfo() {
    cy.findByTestId('help-text').within(() => {
      cy.findByText('If you already scheduled your appointment').click();
    });
    return this;
  }

  /**
   * Validates the URL for the page
   */
  _validateUrl() {
    cy.url().should('include', '/schedule-referral');
    return this;
  }

  /**
   * Validates the header for the page
   */
  _validateHeader() {
    cy.findByRole('heading', { level: 1, name: /Referral for /i }).should(
      'exist',
    );
    return this;
  }
}

export default new ScheduleReferralPageObject();
