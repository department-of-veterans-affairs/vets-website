import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftsResponse from './fixtures/draftPageResponses/draft-threads-response.json';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import SharedComponents from './pages/SharedComponents';

describe('save draft feature tests', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  it('save new draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory('OTHER');
    PatientComposePage.getMessageSubjectField().type(`test subject`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(`test body`, { force: true });
    PatientComposePage.saveNewDraft('OTHER', 'test subject');
    cy.get(Locators.ALERTS.SAVE_DRAFT).should('contain', 'message was saved');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('re-save existing draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    PatientComposePage.selectCategory('COVID');
    PatientComposePage.getMessageSubjectField().type(`-updated`, {
      force: true,
    });

    PatientMessageDraftsPage.saveExistingDraft(
      'COVID',
      'newSavedDraft-updated',
    );

    cy.get(Locators.ALERTS.SAVE_ALERT).should(
      'contain',
      `message was saved on ${currentDate}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify data updates after each rendering', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    PatientComposePage.selectCategory('COVID');
    PatientComposePage.getMessageSubjectField().type(`-updated`, {
      force: true,
    });

    PatientMessageDraftsPage.saveExistingDraft(
      'COVID',
      'newSavedDraft-updated',
    );

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      mockDraftsResponse,
    ).as('reFetchResponse');

    SharedComponents.clickBackBreadcrumb();

    cy.wait('@reFetchResponse').then(interception => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get(`@reFetchResponse.all`).should(`have.length.at.least`, 1);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
