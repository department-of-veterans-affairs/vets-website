import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data } from '../utils/constants';

describe('Secure Messaging Compose Errors Keyboard Nav', () => {
  const landingPage = new PatientInboxPage();
  // const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('focus on error message for no provider', () => {
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.pushSendMessageWithKeyboardPress();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientComposePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_RECIPIENT);
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty category', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessage(Data.PLEASE_SELECT_CATEGORY);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientComposePage.selectCategory();
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnDeleteDraftButton();
  });

  it('focus on error message for empty message subject', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessage(Data.SUBJECT_CANNOT_BLANK);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientComposePage.getMessageSubjectField().type(
      Data.TEST_MESSAGE_SUBJECT,
      { force: true },
    );
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnDeleteDraftButton();
  });
  it('focus on error message for empty message body', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifyFocusOnErrorMessage(Data.BODY_CANNOT_BLANK);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY);
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnDeleteDraftButton();
  });
});
