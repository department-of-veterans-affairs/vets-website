import PageObject from '../../page-objects/PageObject';

export class ReferralsAndRequestsPageObject extends PageObject {
  /**
   * Validates that we're on the Referrals and Requests page
   */
  validatePageLoaded() {
    // Check for the header
    cy.findByRole('heading', {
      level: 1,
      name: 'Referrals and requests',
    }).should('exist');

    return this;
  }

  /**
   * Asserts the presence of pending referrals on the page
   * @param {Object} options - Options for assertion
   * @param {number} options.count - Expected number of referrals
   * @param {boolean} options.exist - Whether referrals should exist
   */
  assertPendingReferrals({ count = 0 } = {}) {
    if (count > 0) {
      cy.findAllByTestId('appointment-list-item').should('have.length', count);
    } else {
      cy.findByRole('heading', {
        level: 2,
        name: /You don’t have any referrals/i,
      }).should('exist');
    }

    return this;
  }

  /**
   * Validates that an API error message is displayed when referrals list fails to load
   */
  assertApiError() {
    // This uses curly apostrophes as required by VA style guidelines
    cy.findByText(/We’re sorry. We’ve run into a problem/i).should('exist');
    return this;
  }

  /**
   * Selects a referral from the list to begin scheduling
   * @param {number} index - Index of the referral to select (0-based)
   */
  selectReferral(index = 0) {
    cy.findAllByTestId('appointment-list-item')
      .eq(index)
      .within(() => {
        cy.findByTestId('schedule-appointment-link').click({
          waitForAnimations: true,
        });
      });

    return this;
  }

  /**
   * Validates the URL and breadcrumb for the page
   */
  _validateUrl() {
    cy.url().should('include', '/my-health/appointments/referrals-requests');
    return this;
  }

  /**
   * Validates the header for the page
   */
  _validateHeader() {
    cy.findByRole('heading', {
      level: 1,
      name: 'Referrals and requests',
    }).should('exist');
    return this;
  }
}

export default new ReferralsAndRequestsPageObject();
