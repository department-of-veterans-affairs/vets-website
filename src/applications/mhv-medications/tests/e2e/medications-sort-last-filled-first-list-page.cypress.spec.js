import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications List Page Sort By Last Filled First', () => {
  it('visits medications list page sort last filled first', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const listLength = 29;
    const sortedData = listPage.sortPrescriptionsByLastFilledCustom(rxList);
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions?page=1&per_page=10&sort=last-fill-date',
      sortedData,
    ).as('sortedPrescriptions');
    listPage.visitMedicationsListPageURL(sortedData);
    listPage.selectSortDropDownOption('Last filled first');
    listPage.validateMedicationsListSorted(sortedData);
    listPage.verifyPaginationDisplayedforSortLastFilledFirst(1, 10, listLength);
    listPage.verifySortScreenReaderActionText('Sorting: Last filled first');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
