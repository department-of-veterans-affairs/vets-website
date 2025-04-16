export class ReferralsAndRequestsPageObject {
  /**
   * Validates that we're on the Referrals and Requests page
   */
  validatePageLoaded() {
    // Check for the header
    cy.findByRole('heading', {
      level: 1,
      name: 'Requests and referrals',
    }).should('exist');

    return this;
  }

  /**
   * Asserts the presence of pending referrals on the page
   * @param {Object} options - Options for assertion
   * @param {number} options.count - Expected number of referrals
   * @param {boolean} options.exist - Whether referrals should exist
   */
  assertPendingReferrals({ count = 0, exist = true } = {}) {
    if (exist) {
      cy.findAllByTestId('pending-referral-card').should('have.length', count);
    } else {
      cy.findByText(/You don't have any referrals/i).should('exist');
    }

    return this;
  }

  /**
   * Selects a referral from the list to begin scheduling
   * @param {number} index - Index of the referral to select (0-based)
   */
  selectReferral(index = 0) {
    cy.findAllByTestId('pending-referral-card')
      .eq(index)
      .within(() => {
        cy.findByText(/Schedule an appointment/i).click({
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
      name: 'Requests and referrals',
    }).should('exist');
    return this;
  }
}

export default new ReferralsAndRequestsPageObject();
