import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT } from './utils/constants';
import threadResponse from './fixtures/thread-response-new-api.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe('SM REPLY MESSAGE DETAILS', () => {
  const date = new Date();
  threadResponse.data[0].attributes.sentDate = date.toISOString();

  it('VERIFY REPLY MESSAGE THREAD DETAILS', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread();

    PatientMessageDetailsPage.loadReplyMessageThread();
    PatientInterstitialPage.getContinueButton().click({ force: true });

    PatientReplyPage.verifyReplyHeader();

    PatientMessageDraftsPage.verifyAttachFileBtn();
    PatientMessageDraftsPage.verifySendDraftBtn();
    PatientMessageDraftsPage.verifySaveDraftBtn();
    PatientMessageDraftsPage.verifyDeleteDraftBtn();
    PatientMessageDetailsPage.verifyExpandedMessageDate(threadResponse);
    PatientMessageDetailsPage.verifyExpandedMessageId(threadResponse);
    PatientMessageDetailsPage.verifyExpandedMessageTo(threadResponse);
    PatientMessageDetailsPage.verifyExpandedMessageFrom(threadResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
