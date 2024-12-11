import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('SM DELETE DRAFT WITH NO CHANGES', () => {
  it('navigate back to inbox', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    GeneralFunctionsPage.verifyPageHeader(`Inbox`);
    GeneralFunctionsPage.verifyUrl(`inbox`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate back to landing page', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage();
    PatientInboxPage.navigateToComposePage();
    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    GeneralFunctionsPage.verifyPageHeader(`Messages`);
    cy.url().should(`eq`, Data.URL.LANDING_PAGE);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
