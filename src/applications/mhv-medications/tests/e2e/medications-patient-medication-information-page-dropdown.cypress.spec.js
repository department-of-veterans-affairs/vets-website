import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsInformationPage from './pages/MedicationsInformationPage';

describe('Medications Information Page DropDown', () => {
  it('visits what to know dropdown on medication information page', () => {
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
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPage(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    detailsPage.verifyMedicationInformationTitle(
      rxTrackingDetails.data.attributes.prescriptionName,
    );
    informationPage.clickWhatToKnowBeforeYouPrintOrDownloadDropDown();
    informationPage.verifyTextInsideDropDownOnInformationPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
