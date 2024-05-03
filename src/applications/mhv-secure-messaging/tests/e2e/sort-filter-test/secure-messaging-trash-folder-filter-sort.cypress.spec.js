import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageTrashPage from '../pages/PatientMessageTrashPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Trash Folder checks', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageTrashPage.loadMessages();
  });

  it('Verify filter works correctly', () => {
    PatientMessageTrashPage.inputFilterDataText('test');
    PatientMessageTrashPage.clickFilterMessagesButton();
    PatientMessageTrashPage.verifyFilterResultsText('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessageTrashPage.inputFilterDataText('any');
    PatientMessageTrashPage.clickFilterMessagesButton();
    PatientMessageTrashPage.clickClearFilterButton();
    PatientMessageTrashPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    PatientMessageTrashPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
