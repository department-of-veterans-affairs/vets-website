import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessagesDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Draft Folder checks', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const draftsPage = new PatientMessagesDraftsPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftsPage.loadMessages();
  });

  it('Verify filter works correctly', () => {
    draftsPage.inputFilterDataText('test');
    draftsPage.clickFilterMessagesButton();
    draftsPage.verifyFilterResultsText('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    draftsPage.inputFilterDataText('any');
    draftsPage.clickFilterMessagesButton();
    draftsPage.clickClearFilterButton();
    draftsPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    draftsPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
