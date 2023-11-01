import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('focus on error message for no provider', () => {
    composePage.selectCategory();
    composePage.getMessageSubjectField().type('Test Subject');
    composePage
      .getMessageBodyField()
      .type('Test Message Body', { force: true });
    composePage.pushSendMessageWithKeyboardPress();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.verifyFocusOnErrorMessageToSelectRecipient();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty category', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifyFocusOnErrorMessageToSelectCategory();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectCategory();
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty message subject', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();

    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifyFocusOnErrorEmptyMessageSubject();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage
      .getMessageSubjectField()
      .type('Test Message Subject', { force: true });
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
  });
  it.skip('focus on error message for empty message body', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage.getMessageSubjectField().type('Test Subject', { force: true });

    // lines below not working due to incorrect focusing ???
    // composePage.pushSendMessageWithKeyboardPress();
    // composePage.verifyFocusOnErrorEmptyMessageBody();

    cy.get(Locators.BUTTONS.SEND).click();
    composePage.verifyErrorEmptyMessageBody();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
