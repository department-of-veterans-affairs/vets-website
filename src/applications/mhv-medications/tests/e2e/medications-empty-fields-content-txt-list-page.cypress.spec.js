import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data, DownloadFormat } from './utils/constants';

describe('Medications Download Txt Empty Field Content on List Page', () => {
  it('visits download txt empty field content text on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    listPage.clickDownloadListAsTxtButtonOnListPage();
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    site.verifyDownloadedFile({
      searchText: Data.REASON_FOR_USE_EMPTY,
      format: DownloadFormat.TXT,
    });
  });
});
