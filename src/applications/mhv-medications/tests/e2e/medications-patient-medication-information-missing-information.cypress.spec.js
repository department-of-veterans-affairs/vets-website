import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsInformationPage from './pages/MedicationsInformationPage';

describe('Medication Information Missing Information', () => {
  it('visits medication information page and displays no information warning message', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    const informationPage = new MedicationsInformationPage();
    const cardNumber = 16;
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPageWithNoInfo(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    informationPage.verifyNoInformationWarningText();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
