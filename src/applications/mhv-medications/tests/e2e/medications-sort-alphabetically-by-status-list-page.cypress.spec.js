import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications List Page Sort Alphabetically By Status', () => {
  it('visits medications list page sort alphabetically by status', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const listLength = 29;
    const sortedData = listPage.sortPrescriptionsByNameAndLastFillDate(rxList);
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=10&sort=alphabetical-rx-name',
      sortedData,
    ).as('sortedPrescriptions');
    listPage.visitMedicationsListPageURL(sortedData);

    // Alphabetically by status is the default value, so select a different option then switch back
    listPage.selectSortDropDownOption('Alphabetically by name');
    listPage.selectSortDropDownOption('Alphabetically by status');

    listPage.validateMedicationsListSorted(sortedData);
    listPage.verifyPaginationDisplayedforSortAlphabeticallyByStatus(
      1,
      10,
      listLength,
    );
    listPage.verifySortScreenReaderActionText(
      'Sorting: Alphabetically by status',
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
