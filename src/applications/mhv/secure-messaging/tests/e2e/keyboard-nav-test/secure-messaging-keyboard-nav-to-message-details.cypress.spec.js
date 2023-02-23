import PatientInboxPage from '../pages/PatientInboxPage';

describe('Navigate to Message Details ', () => {
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
  });
  it('navigate Print Button', () => {
    landingPage.navigatePrintCancelButton();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });
  it('navigate Trash Button', () => {
    landingPage.navigateTrash();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });
  it('navigate Reply Button', () => {
    landingPage.navigateReply();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"]').should('exist');
  });
});
