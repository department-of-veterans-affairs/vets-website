import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Verify Compose Data When Cancel Navigate Away', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  // const composePage = new PatientComposePage();

  it('Verify Data When Cancel Navigate Away', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.verifyAlertModal();
    PatientComposePage.clickOnContinueEditingButton();

    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    PatientComposePage.verifyRecipientNameText();
    PatientComposePage.verifySubjectFieldText('testSubject');
  });
});
