import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';
import categories from './fixtures/categories-response.json';

describe('Secure Messaging Compose Categories', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();
  const listOfCategories = categories.data.attributes.messageCategoryType;

  beforeEach(() => {
    site.login();
  });

  it('can send message for categories', () => {
    for (let i = 0; i < listOfCategories.length; i += 1) {
      landingPage.loadInboxMessages();
      landingPage.navigateToComposePage();
      composePage.selectRecipient();

      composePage.getCategory(listOfCategories[i]).click();

      composePage.enterDataToMessageSubject();
      composePage.enterDataToMessageBody();
      composePage.sendMessage();
      composePage.verifySendMessageConfirmationMessageText();

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    }
  });
});
