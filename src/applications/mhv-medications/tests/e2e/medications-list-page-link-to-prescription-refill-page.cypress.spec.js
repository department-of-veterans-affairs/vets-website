import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/refill-page-prescription-requests.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Refill Prescriptions Link', () => {
  it('visits Medications list Page Refill Prescriptions Link', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    const refillPage = new MedicationsRefillPage();
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
  });
});
