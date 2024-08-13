import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessageWithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Navigate to Message Details ', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    PatientMessageDetailsPage.loadMessageDetails(mockMessageWithAttachment);
  });

  it('keyboard navigation to expand messages', () => {
    PatientMessageDetailsPage.verifyMessageExpandAndFocusByKeyboard();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('keyboard navigation to main buttons', () => {
    PatientMessageDetailsPage.verifyButtonsKeyboardNavigation();

    cy.tabToElement('#print-button')
      .should('contain', 'Print')
      .and('have.focus');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.MOVE)
      .should(`contain`, `Move`)
      .and('have.focus');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.TRASH)
      .should(`contain`, `Trash`)
      .and('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
