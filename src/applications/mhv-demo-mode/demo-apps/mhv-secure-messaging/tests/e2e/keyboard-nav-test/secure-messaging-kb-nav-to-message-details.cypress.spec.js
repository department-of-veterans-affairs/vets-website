import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import singleThreadResponse from '../fixtures/thread-response-new-api.json';

describe('Navigate to Message Details ', () => {
  beforeEach(() => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    GeneralFunctionsPage.verifyHeaderFocused();
  });

  it('keyboard navigation to expand messages', () => {
    PatientMessageDetailsPage.verifyMessageExpandAndFocusByKeyboard();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('keyboard navigation to main buttons', () => {
    PatientMessageDetailsPage.verifyButtonsKeyboardNavigation();

    PatientMessageDetailsPage.verifyReplyButtonByKeyboard('reply');
    PatientMessageDetailsPage.verifySingleButtonByKeyboard('print');
    PatientMessageDetailsPage.verifySingleButtonByKeyboard('move');
    PatientMessageDetailsPage.verifySingleButtonByKeyboard('trash');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
