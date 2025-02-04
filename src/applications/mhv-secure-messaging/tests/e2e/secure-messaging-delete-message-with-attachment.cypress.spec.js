import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/thread-response-new-api.json';

describe('SM DELETE MESSAGE', () => {
  it('verify delete message with attachment', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientComposePage.clickTrashButton();

    PatientComposePage.clickConfirmDeleteButton({
      data: updatedSingleThreadResponse.data[0],
    });
    PatientComposePage.verifyDeleteDraftSuccessfulMessageText();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
