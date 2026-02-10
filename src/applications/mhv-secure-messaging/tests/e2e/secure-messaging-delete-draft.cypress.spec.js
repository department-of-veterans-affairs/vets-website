import mockSingleDraft from './fixtures/draftPageResponses/single-draft-response.json';
import mockMessages from './fixtures/threads-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Secure Messaging Delete Draft', () => {
  it(' Delete Existing Draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    PatientInterstitialPage.getContinueButton().should('not.exist');
    PatientMessageDraftsPage.clickDeleteButton();

    PatientMessageDraftsPage.confirmDeleteDraft(mockSingleDraft);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDeleteConfirmationButton();
    PatientMessageDraftsPage.verifyDraftDeletedAlertAndH1Focus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('THREAD LIST RE-FETCHING VERIFICATION DELETE DRAFT', () => {
  it('verify data updates after each rendering', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      mockMessages,
    ).as('reFetchResponse');

    PatientInterstitialPage.getContinueButton().should('not.exist');
    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.confirmDeleteDraft(mockSingleDraft);

    cy.wait('@reFetchResponse').then(interception => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get(`@reFetchResponse.all`).should(`have.length.at.least`, 1);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
