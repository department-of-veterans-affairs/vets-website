import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsInformationPage from './pages/MedicationsInformationPage';
import noMedicationInformation from './fixtures/missing-patient-medication-information.json';

describe('Medication Information Missing Information', () => {
  it('visits medication information page and displays no information warning message', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const informationPage = new MedicationsInformationPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.intercept(
      'GET',
      `my_health/v1/prescriptions/${cardNumber}/documentation?station_number=*`,
      noMedicationInformation,
    ).as('medicationDescription');
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPageWithNoInfo(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    informationPage.verifyNoInformationWarningText();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
