import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Alerts } from './utils/constants';

describe('Medications Nav to Error Alert for Details Page', () => {
  it('visits List Page Breadcrumb for Error Alert', () => {
    const site = new MedicationsSite();
    const detailsPage = new MedicationsDetailsPage();
    const listPage = new MedicationsListPage();
    const incorrectRxNumber = '23845196';
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.visitMedDetailsPage(incorrectRxNumber);
    detailsPage.verifyNoMedicationsErrorAlertWhenUserNavsToDetailsPage(
      Alerts.NO_ACCESS_TO_MEDICATIONS_ERROR,
    );
    detailsPage.clickMedicationsListPageBreadcrumbsOnDetailsPage();
    listPage.verifyNavigationToListPageAfterClickingBreadcrumbMedications();
  });
});
