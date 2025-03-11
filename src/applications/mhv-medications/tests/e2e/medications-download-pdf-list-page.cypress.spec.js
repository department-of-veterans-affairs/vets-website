import moment from 'moment-timezone';
import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download PDF on Medications List Page', () => {
  it('visits download pdf on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    listPage.clickDownloadListAsPDFButtonOnListPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    site.verifyDownloadedPdfFile(
      'VA-medications-list-Safari-Mhvtp',
      moment(),
      '',
    );
  });
});
