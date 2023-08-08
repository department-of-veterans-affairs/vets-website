import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';

describe('Navigate to Message Details ', () => {
  it('Keyboard Navigation to Print Button', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessagewithAttachment);

    cy.intercept(
      'PATCH',
      'my_health/v1/messaging/threads/7176615/move?folder_id=-3',
      {},
    );

    cy.get('[data-testid="move-button-text"]').click({ timeout: 5000 });

    cy.get('va-radio[class="form-radio-buttons hydrated"]')
      .find('[for="radiobutton-Deleted"]')
      .should('exist')
      .click();

    cy.get('[type="button"]')
      .contains('Confirm')
      .click();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });

    cy.get('[close-btn-aria-label="Close notification"]').should(
      'have.text',
      'Message conversation was successfully moved.',
    );
  });
});
