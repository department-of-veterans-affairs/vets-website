import MedicationsSite from './med_site/MedicationsSite';
import refillPrescriptions from './fixtures/refill-page-prescription-requests.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Nav to List Page from Refill Page', () => {
  it('visits Medications List Page Link On Refills Page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listPage = new MedicationsListPage();
    site.login();
    refillPage.loadRefillPage(refillPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.clickGoToMedicationsListPage();
    listPage.verifyMedicationsListPageTitle();
  });
});
