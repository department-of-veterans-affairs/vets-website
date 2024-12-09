import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import FolderLoadPage from './pages/FolderLoadPage';

describe('SM SINGLE MESSAGE', () => {
  it('single message buttons check', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );

    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientMessageDetailsPage.verifySingleButton(`reply`);
    PatientMessageDetailsPage.verifySingleButton(`print`);
    PatientMessageDetailsPage.verifySingleButton(`move`);
    PatientMessageDetailsPage.verifySingleButton(`trash`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageDetailsPage.verifyTrashButtonModal();
    PatientMessageDetailsPage.verifyMoveToButtonModal();

    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();

    PatientReplyPage.getMessageBodyField().should('be.visible');
    GeneralFunctionsPage.verifyUrl(`reply`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    FolderLoadPage.backToParentFolder();
  });
});
