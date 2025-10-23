import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications List Page Sort Alphabetically By Status', () => {
  it('validates medications are sorted by status, name, and fill date', () => {
    const listLength = 29;
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const sortedData = listPage.sortPrescriptionsByStatusNameAndFillDate(
      rxList,
    );
    site.login();
    cy.intercept('GET', '/my_health/v1/prescriptions', sortedData).as(
      'sortedPrescriptions',
    );
    listPage.visitMedicationsListPageURL(sortedData);
    listPage.validateMedicationsListSortedAlphabeticallyByStatus(sortedData);
    listPage.verifyPaginationDisplayedforSortAlphabeticallyByStatus(
      1,
      10,
      listLength,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
