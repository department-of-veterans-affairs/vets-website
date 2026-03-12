import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsInformationPage from './pages/MedicationsInformationPage';

describe('Medication Information Error Message', () => {
  it('visits medication information page and displays API error message', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const informationPage = new MedicationsInformationPage();
    const cardNumber = 16;
    const { prescriptionId } = rxTrackingDetails.data.attributes;
    site.login();
    // Set up the error intercept before visiting the list page so it catches the prefetch
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions/${prescriptionId}/documentation*`,
      { statusCode: 500, body: { error: 'Internal Server Error' } },
    ).as('medicationDescriptionError');
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPageError();
    informationPage.verifyApiErrorText();
    informationPage.verifyFocusOnAPIErrorAlertTextOnPatientInformationPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
