import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications Download Txt Empty Field Content on List Page', () => {
  it('visits download txt empty field content text on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const fixedDate = new Date(2025, 5, 5, 10, 42, 2); // June 5, 2025, 09:42:02 AM
    // cy.clock(fixedDate.getTime(), ['Date']);
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    cy.clock(fixedDate.getTime(), ['Date']);
    listPage.clickDownloadListAsTxtButtonOnListPage();
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    listPage.verifyDownloadTextFileHeadless('Safari', 'Mhvtp', 'not available');
    // listPage.verifyContentInListPageDownload(fixedDate);
  });
});
