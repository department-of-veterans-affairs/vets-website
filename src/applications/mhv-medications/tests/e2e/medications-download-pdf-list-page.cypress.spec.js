import moment from 'moment-timezone';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download PDF on Medications List Page', () => {
  it('visits download pdf on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    listPage.clickDownloadListAsPDFButtonOnListPage();
    // listPage.verifyLoadingSpinnerForDownloadOnListPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
    site.verifyDownloadedPdfFile(
      'VA-medications-list-Safari-Mhvtp',
      moment(),
      '',
    );
  });
});
