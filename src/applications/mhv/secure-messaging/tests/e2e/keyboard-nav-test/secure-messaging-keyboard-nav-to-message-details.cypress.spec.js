import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailKeyboardPage from '../pages/PatientMessageDetailKeyboardPage';

describe('Navigate to Message Details ', () => {
  const navButton = new PatientMessageDetailKeyboardPage();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().attributes.recipientId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.senderId,
    );
  });
  it('navigate Print Button', () => {
    navButton.navigatePrintButton();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });
  it('navigate Trash Button', () => {
    navButton.navigateTrashButton();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });

  it('navigate move button', () => {
    navButton.navigateMoveToButton();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });
});
