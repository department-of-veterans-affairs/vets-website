import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download PDF Error Allergies API Call Fail on List Page', () => {
  it('visits download pdf error when allergies api call fails on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGoToMedicationsLinkWhenNoAllergiesAPICallFails();
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.clickDownloadListAsPDFButtonOnListPage();
    listPage.verifyDownloadErrorMessageForAllergiesAPICallFail();
  });
});
