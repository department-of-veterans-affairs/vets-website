import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download Txt Error when API Call Fails on List Page', () => {
  it('visits download txt error when allergies api call fails on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsLinkWhenNoAllergiesAPICallFails();
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.clickDownloadListAsTxtButtonOnListPage();
    listPage.verifyDownloadErrorMessageForAllergiesAPICallFail();
    listPage.verifyFocusOnDownloadFailureAlertBanner();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
