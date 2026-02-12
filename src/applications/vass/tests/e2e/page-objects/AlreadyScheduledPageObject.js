import PageObject from './Page-Object';
import { VASS_PHONE_NUMBER } from '../../../utils/constants';

export class AlreadyScheduledPageObject extends PageObject {
  /**
   * Assert the Already Scheduled page is displayed with all expected elements
   * @returns {AlreadyScheduledPageObject}
   */
  assertAlreadyScheduledPage() {
    // Page heading
    this.assertHeading({
      name: 'You already scheduled your appointment with VA Solid Start',
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertErrorAlert({ exist: false });

    // Page structure
    this.assertElement('already-scheduled-page');

    // Date/time message
    this.assertElement('already-scheduled-date-time', {
      containsText: 'Your VA Solid Start appointment is scheduled for',
    });

    // Phone number message with contact info
    this.assertElement('already-scheduled-phone-number', {
      containsText:
        'Your VA Solid Start representative will call you at the time you requested',
    });
    cy.findByTestId('already-scheduled-phone-number')
      .find('va-telephone')
      .should('exist')
      .and('have.attr', 'contact', VASS_PHONE_NUMBER);

    // Cancel button
    cy.findByTestId('already-scheduled-cancel-button')
      .should('exist')
      .and('have.attr', 'text', 'Cancel this appointment');

    // Reschedule message with phone number
    this.assertElement('already-scheduled-reschedule-message', {
      containsText: 'If you want to reschedule this appointment, call us at',
    });
    cy.findByTestId('already-scheduled-reschedule-message')
      .find('va-telephone')
      .should('exist')
      .and('have.attr', 'contact', VASS_PHONE_NUMBER);

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Click the cancel appointment link
   * @returns {AlreadyScheduledPageObject}
   */
  clickCancelAppointment() {
    cy.findByTestId('already-scheduled-cancel-button').click();
    return this;
  }
}

export default new AlreadyScheduledPageObject();
