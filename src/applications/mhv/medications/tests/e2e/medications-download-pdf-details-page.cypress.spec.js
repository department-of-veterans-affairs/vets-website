import moment from 'moment-timezone';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Download', () => {
  it('visits Medications Details Page Download PDF Dropdown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage();
    detailsPage.clickDownloadMedicationDetailsAsPdfOnDetailsPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner();
    site.verifyDownloadedPdfFile(
      'VA-medications-list-Safari-Mhvtp',
      moment(),
      '',
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
