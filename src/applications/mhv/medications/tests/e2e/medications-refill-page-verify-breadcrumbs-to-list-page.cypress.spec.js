import MedicationsSite from './med_site/MedicationsSite';
import refillPrescriptions from './fixtures/refill-page-prescription-requests.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Refill Page Breadcrumb', () => {
  it('visits Medications Refill Page Breacrumb Nav', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listPage = new MedicationsListPage();
    site.login();
    refillPage.loadRefillPage(refillPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.clickBackToMedicationsBreadcrumbOnRefillPage();
    listPage.verifyMedicationsListPageTitle();
  });
});
