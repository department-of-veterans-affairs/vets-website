import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download Alert Not Visible after Reload List Page', () => {
  it('visits no download txt alert after reload on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    listPage.clickDownloadListAsTxtButtonOnListPage();
    // listPage.verifyLoadingSpinnerForDownloadOnListPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner();
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    listPage.verifyDownloadTextFileHeadless('Safari', 'Mhvtp', 'Mhvtp, Safari');
    cy.reload();
    listPage.verifyDownloadSuccessMessageBannerNotVisibleAfterReload();
  });
});
