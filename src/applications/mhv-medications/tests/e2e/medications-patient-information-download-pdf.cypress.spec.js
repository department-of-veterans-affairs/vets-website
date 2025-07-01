import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsInformationPage from './pages/MedicationsInformationPage';
import { Data } from './utils/constants';

describe('Medications Details Page Medication Information pdf download', () => {
  it('visits Medications Info Page Download PDF', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const medInfoPage = new MedicationsInformationPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPage(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    detailsPage.verifyMedicationInformationTitle(
      rxTrackingDetails.data.attributes.prescriptionName,
    );
    detailsPage.clickPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    medInfoPage.clickDownloadPDFOnInformationPage();
    medInfoPage.verifyDownloadSuccessConfirmationMessageOnMedInfoPage(
      Data.DOWNLOAD_SUCCESS_CONFIRMATION_MESSAGE,
    );
    medInfoPage.verifyDownloadSuccessAlertContentOnMedInfoPage(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    // medInfoPage.verifyMedicationDescriptionInDownload(
    //   rxTrackingDetails.data.attributes.prescriptionName,
    //   'pdf',
    // );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
