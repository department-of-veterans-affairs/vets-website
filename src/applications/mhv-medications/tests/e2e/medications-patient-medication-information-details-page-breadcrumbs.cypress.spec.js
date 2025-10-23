import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsInformationPage from './pages/MedicationsInformationPage';

describe('Medications Details Page Medication Information Breadcrumb', () => {
  it('visits Medications Details Page Medication Information Breadcrumb', () => {
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
    medInfoPage.verifyBreadCrumbsTextDoesNotHaveRxName(
      'Back',
      rxTrackingDetails.data.attributes.prescriptionName,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
