import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionRefillDetails from './fixtures/prescription-refill-button-details-page.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Refill Button', () => {
  it('visits Medications Details Page Refill Button', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(prescriptionRefillDetails);
    detailsPage.verifyRefillButtonEnabledOnMedicationsDetailsPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
