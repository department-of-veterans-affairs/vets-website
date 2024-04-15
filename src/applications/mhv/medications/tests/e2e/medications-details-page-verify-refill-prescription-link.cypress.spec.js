import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/active-prescriptions-with-refills.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/refill-page-prescription-requests.json';

describe('verify details page link to refill prescription', () => {
  it('verify Medications details Page Link to refill prescription', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    const refillsPage = new MedicationsRefillPage();
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails);
    refillsPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillsPage.verifyRefillPageTitle();
  });
});
