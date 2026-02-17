import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsInformationPage from './pages/MedicationsInformationPage';
import { Data, DownloadFormat } from './utils/constants';

describe('Medications Details Page Medication Information txt download', () => {
  it('visits Medications Info Page Download TXT', () => {
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
    detailsPage.clickPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    medInfoPage.clickDownloadTXTOnInformationPage();
    medInfoPage.verifyDownloadSuccessConfirmationMessageOnMedInfoPage(
      Data.DOWNLOAD_SUCCESS_CONFIRMATION_MESSAGE,
    );
    medInfoPage.verifyDownloadSuccessAlertContentOnMedInfoPage(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    site.verifyDownloadedFile({
      prefixString: `medication-information-${rxTrackingDetails.data.attributes.prescriptionName}-Safari-Mhvtp`,
      searchText: rxTrackingDetails.data.attributes.prescriptionName,
      format: DownloadFormat.TXT,
    });
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
