import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';

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
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });
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
    composePage.selectRecipient();
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty category', () => {
    composePage.selectRecipient();
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
    composePage.selectRecipient();
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
      .type(Data.TEST_MESSAGE_SUBJECT, { force: true });
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
  });
  it('focus on error message for empty message body', () => {
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage
      .getMessageSubjectField()
      .type(Data.TEST_SUBJECT, { force: true });
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifyFocusOnErrorEmptyMessageBody();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
  });
});
