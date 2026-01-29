import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Breadcrumbs', () => {
  it('visits Medications Details Page Breadcrumbs', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.clickMedicationsListPageBreadcrumbsOnDetailsPage();
    listPage.verifyNavigationToListPageAfterClickingBreadcrumbMedications();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
