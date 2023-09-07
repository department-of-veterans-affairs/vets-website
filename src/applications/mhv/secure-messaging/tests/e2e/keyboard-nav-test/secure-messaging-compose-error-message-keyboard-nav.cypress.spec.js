import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT } from '../utils/constants';

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
    composePage.getCategory('COVID');

    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test Message Body');
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifyFocusOnErrorMessageToSelectRecipient();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('focus on error message for empty category', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');

    composePage.getMessageSubjectField().type('Test Subject');
    composePage.getMessageBodyField().type('Test Message Body');
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
  });
  it('focus on error message for empty message subject', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage.getMessageBodyField().type('Test Message Body');
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
  });
  it('focus on error message for empty message body', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage.getMessageSubjectField().type('Test Subject');
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
  });
});
