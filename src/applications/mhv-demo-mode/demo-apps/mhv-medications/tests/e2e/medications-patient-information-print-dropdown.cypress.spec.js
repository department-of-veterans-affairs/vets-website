import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Medication Information Print DropDown', () => {
  it('visits Medications Details Page Medication Information Print DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPage(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    detailsPage.verifyPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    detailsPage.clickPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    detailsPage.verifyDownloadPdfDropDownOptionOnMedicationInformationPage();
    detailsPage.verifyDownloadTxtDropDownOptionOnMedicationInformationPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
