import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Navigate to Message Details ', () => {
  it('Keyboard Navigation to Print Button', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessagewithAttachment);
    cy.contains('Print').should('be.visible');
    cy.tabToElement('button')
      .eq(0)
      .should('contain', 'Print');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_MOVE).should('have.focus');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_TRASH).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
  });
});
