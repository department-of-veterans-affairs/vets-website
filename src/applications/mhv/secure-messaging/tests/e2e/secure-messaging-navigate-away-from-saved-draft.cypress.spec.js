import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Navigate Away From `Start a new message`', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();

  it('Navigate Away From `Saved Draft` To Inbox', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.saveDraftButton().should('be.visible');
    composePage.saveDraftButton().click();

    composePage.selectSideBarMenuOption('Inbox');
    composePage.verifyExpectedPageOpened('Inbox');
    cy.get('[data-testid="compose-message-link"]').should('be.visible');
  });
});
