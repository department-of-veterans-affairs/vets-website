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
    listPage.selectSortDropDownOption('Alphabetically by name');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=10&sort=alphabetical-rx-name',
      sortedData,
    ).as('sortedPrescriptions');
    listPage.visitMedicationsListPageURL(sortedData); // revisit the page so the name option is selected

    listPage.selectSortDropDownOption('Alphabetically by status');

    listPage.validateMedicationsListSorted(sortedData);
    listPage.verifyPaginationDisplayedforSortAlphabeticallyByStatus(
      1,
      10,
      listLength,
    );
    listPage.verifyFilterAriaRegionText(
      'Showing 1 - 10 of 29 medications, alphabetically by status',
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
