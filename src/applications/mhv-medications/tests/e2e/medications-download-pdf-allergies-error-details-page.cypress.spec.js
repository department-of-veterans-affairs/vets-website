import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Download pdf error when allergies api fails on details page', () => {
  it('visits Medications Details Page Download PDF Error When Allergies API Fails', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGoToMedicationsLinkWhenNoAllergiesAPICallFails();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage();
    detailsPage.clickDownloadMedicationDetailsAsPdfOnDetailsPage();
    listPage.verifyDownloadErrorMessageForAllergiesAPICallFail();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
