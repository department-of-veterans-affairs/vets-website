import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Medication Information Print This Page DropDown', () => {
  it('visits Medications Details Page Medication Information Print This Page DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    const cardNumber = 16;
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPage(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    detailsPage.verifyPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    detailsPage.clickPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    detailsPage.verifyPrintThisPageDropDownOptionOnMedicationInformationPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
