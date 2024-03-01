import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Navigate to Print DropDown on Details Page', () => {
  it('verify print dropdown on Medications details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
   
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickPrintOrDownloadThisPageDropDownOnDetailsPage();
    detailsPage.verifyPrintButtonEnabledOnDetailsPage();
  });
});
