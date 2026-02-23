import PageObject from './PageObject';
import { VASS_PHONE_NUMBER } from '../../../utils/constants';

export class ConfirmationPageObject extends PageObject {
  /**
   * Assert the Confirmation page is displayed with all appointment card details
   * @param {Object} options - Options
   * @param {string} options.agentName - Expected agent name (defaults to 'Agent Smith')
   * @param {string[]} options.topics - Expected topic names to verify
   * @returns {ConfirmationPageObject}
   */
  assertConfirmationPage({ agentName = 'Agent Smith', topics = [] } = {}) {
    // Page heading
    this.assertHeading({
      name: 'Your VA Solid Start appointment is scheduled',
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertWrapperErrorAlert({ exist: false });

    // Confirmation page structure
    this.assertElement('confirmation-page');
    this.assertElement('confirmation-message', {
      containsText: 'We’ve confirmed your appointment',
    });

    // Appointment card
    this.assertElement('appointment-card');
    this.assertElement('appointment-type', {
      containsText: 'Phone appointment',
    });

    // How to join section with phone number
    this.assertElement('how-to-join-section', {
      containsText: `Your representative will call you from`,
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

    // Topics section (if topics provided)
    if (topics.length > 0) {
      this.assertElement('topics-section');
      topics.forEach(topic => {
        cy.findByTestId('topics-section').and('contain.text', topic);
      });
    }

    // Action buttons
    this.assertElement('print-button');
    this.assertElement('cancel-button');

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the Confirmation page is displayed in details-only mode (no heading/message)
   * @param {Object} options - Options
   * @param {string} options.agentName - Expected agent name
   * @param {string[]} options.topics - Expected topic names to verify
   * @returns {ConfirmationPageObject}
   */
  assertDetailsOnlyPage({ agentName = 'Agent Smith', topics = [] } = {}) {
    // Page structure without confirmation message
    this.assertElement('confirmation-page');
    this.assertElement('confirmation-message', { exist: false });

    // Appointment card details
    this.assertElement('appointment-card');
    this.assertElement('appointment-type', {
      containsText: 'Phone appointment',
    });

    // How to join section with phone number
    this.assertElement('how-to-join-section');
    cy.findByTestId('solid-start-telephone')
      .should('exist')
      .and('have.attr', 'contact', VASS_PHONE_NUMBER);

    // When section
    this.assertElement('when-section');

    // What section
    this.assertElement('what-section', { containsText: 'VA Solid Start' });

    // Who section with agent name
    this.assertElement('who-section', { containsText: agentName });

    // Topics section (if topics provided)
    if (topics.length > 0) {
      this.assertElement('topics-section');
      topics.forEach(topic => {
        cy.findByTestId('topics-section').and('contain.text', topic);
      });
    }

    // Action buttons
    this.assertElement('print-button');
    this.assertElement('cancel-button');

    return this;
  }

  /**
   * Click the print button
   * @returns {ConfirmationPageObject}
   */
  clickPrint() {
    cy.findByTestId('print-button')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Click the cancel appointment button
   * @returns {ConfirmationPageObject}
   */
  clickCancelAppointment() {
    cy.findByTestId('cancel-button')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Assert the confirmation page "When" section displays the given date/time text.
   * Use this to verify the confirmed appointment shows the updated time (e.g. after changing date/time).
   * @param {string} text - Text that should appear in the When section (e.g. formatted date or time)
   * @returns {ConfirmationPageObject}
   */
  assertWhenSectionContainsDateTime(text) {
    cy.findByTestId('when-section').should('contain.text', text);
    return this;
  }

  /**
   * Assert the add to calendar button
   * @returns {ConfirmationPageObject}
   */
  assertAddToCalendarButton() {
    cy.findByTestId('add-to-calendar-button').should('exist');
    cy.findByTestId('add-to-calendar-link')
      .should('exist')
      .and('have.attr', 'href')
      .and('match', /^data:text\/calendar;charset=utf-8,/);
    return this;
  }

  /**
   * Assert the print functionality
   * @returns {ConfirmationPageObject}
   */
  assertPrintFunctionality() {
    cy.window().then(win => {
      cy.stub(win, 'print').as('printStub');
    });
    cy.findByTestId('print-button')
      .should('exist')
      .click();
    cy.get('@printStub').should('have.been.calledOnce');
    return this;
  }
}

export default new ConfirmationPageObject();
