import PageObject from './PageObject';
import { VASS_PHONE_NUMBER } from '../../../utils/constants';

export class CancelConfirmationPageObject extends PageObject {
  /**
   * Assert the Cancel Confirmation page is displayed with all appointment card details
   * @param {Object} options - Options
   * @param {string} options.agentName - Expected agent name (defaults to 'Agent Smith')
   * @returns {CancelConfirmationPageObject}
   */
  assertCancelConfirmationPage({ agentName = 'Agent Smith' } = {}) {
    // Page heading
    this.assertHeading({
      name: 'You have canceled your appointment',
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertWrapperErrorAlert({ exist: false });

    // Page structure
    this.assertElement('cancel-confirmation-page');

    // Cancellation message with phone number
    this.assertElement('cancel-confirmation-message', {
      containsText: 'If you need to reschedule, call us at',
    });
    cy.findByTestId('cancel-confirmation-phone')
      .should('exist')
      .and('have.attr', 'contact', VASS_PHONE_NUMBER);

    // Appointment card
    this.assertElement('appointment-card');
    this.assertElement('appointment-type', {
      containsText: 'Phone appointment',
    });

    // How to join section with phone number
    this.assertElement('how-to-join-section', {
      containsText: 'Your representative will call you from',
    });
    cy.findByTestId('how-to-join-section').within(() => {
      cy.findByTestId('solid-start-telephone')
        .should('exist')
        .and('have.attr', 'contact', VASS_PHONE_NUMBER);
    });

    // When section
    this.assertElement('when-section');

    // What section
    this.assertElement('what-section', { containsText: 'VA Solid Start' });

    // Who section with agent name
    this.assertElement('who-section', { containsText: agentName });

    // Cancel/print buttons should NOT be present on this page
    this.assertElement('print-button', { exist: false });
    this.assertElement('cancel-button', { exist: false });

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }
}

export default new CancelConfirmationPageObject();
