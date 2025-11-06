import PageObject from '../../page-objects/PageObject';

export class CompleteReferralPageObject extends PageObject {
  /**
   * Validates that we're on the Complete Referral page
   */
  validate() {
    // Check for the header
    cy.findByRole('heading', {
      level: 1,
      name: 'Your appointment is scheduled',
    }).should('exist');

    // Check that main appointment block exists
    cy.findByTestId('appointment-block').should('exist');

    return this;
  }

  /**
   * Validates appointment details are displayed correctly
   */
  assertAppointmentDetails() {
    cy.findByTestId('appointment-date').should('exist');
    cy.findByTestId('appointment-time').should('exist');
    cy.findByTestId('appointment-type').should('exist');
    cy.findByTestId('appointment-modality').should('exist');
    // TODO: appointment-clinic is not available add when available
    // cy.findByTestId('appointment-clinic').should('exist');
    return this;
  }

  /**
   * Validates provider name is displayed correctly
   */
  assertProviderInfo(providerName) {
    if (providerName) {
      cy.findByTestId('appointment-type').should('contain', providerName);
    } else {
      cy.findByTestId('appointment-type').should('exist');
    }
    return this;
  }

  /**
   * Validates that the API error alert is displayed
   */
  assertApiErrorAlert() {
    cy.findByTestId('error-alert').within(() => {
      // This uses curly apostrophes as required by VA style guidelines
      cy.findByText(
        /We’re sorry. Call your community care provider at/i,
      ).should('exist');
      cy.findByTestId('referral-community-care-office').should('exist');
    });
    return this;
  }

  /**
   * Validates that an API error message is displayed when completed appointment details fail to load
   */
  assertApiError() {
    // This uses curly apostrophes as required by VA style guidelines
    cy.findByText(/We can’t schedule this appointment online/i).should('exist');
    this.assertApiErrorAlert();
    return this;
  }

  /**
   * Validates that the not booked error alert is displayed
   */
  assertNotBookedErrorAlert() {
    cy.findByTestId('warning-alert').within(() => {
      cy.findByText(
        /Try refreshing this page. If it still doesn’t work, call your community care provider at/i,
      ).should('exist');
      cy.findByTestId('referral-community-care-office').should('exist');
    });

    return this;
  }

  /**
   * Validates that an API error message is displayed when completed appointment details fail to load
   */
  assertNotBookedError() {
    // This uses curly apostrophes as required by VA style guidelines
    cy.findByText(/We’re having trouble scheduling this appointment/i).should(
      'exist',
    );
    this.assertNotBookedErrorAlert();
    return this;
  }

  /**
   * Validates that the "Review Referrals and Requests" link is available
   */
  assertReferralsLink() {
    cy.findByTestId('return-to-referrals-link').should('exist');
    return this;
  }

  /**
   * Clicks the Details link to view appointment details
   */
  clickDetailsLink() {
    cy.findByTestId('cc-details-link').click();
    return this;
  }

  /**
   * Clicks the "Review Referrals and Requests" link
   */
  clickReferralsAndRequestsLink() {
    cy.findByTestId('return-to-referrals-link').click();
    return this;
  }

  /**
   * Clicks the "Review your appointments" link
   */
  clickViewAppointmentsLink() {
    cy.findByTestId('view-appointments-link').click();
    return this;
  }

  /**
   * Clicks the "Schedule a new appointment" link
   */
  clickScheduleNewAppointmentLink() {
    cy.findByTestId('schedule-appointment-link').click();
    return this;
  }

  /**
   * Validates the URL for the page
   */
  _validateUrl() {
    cy.url().should('include', '/schedule-referral/complete/');
    return this;
  }

  /**
   * Validates the header for the page
   */
  _validateHeader() {
    cy.findByRole('heading', {
      level: 1,
      name: 'Your appointment is scheduled',
    }).should('exist');
    return this;
  }
}

export default new CompleteReferralPageObject();
