import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download PDF Error Allergies API Call Fail on List Page', () => {
  it('visits download pdf error when allergies api call fails on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsLinkWhenNoAllergiesAPICallFails();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.clickDownloadListAsPDFButtonOnListPage();
    listPage.verifyDownloadErrorMessageForAllergiesAPICallFail();
  });
});
