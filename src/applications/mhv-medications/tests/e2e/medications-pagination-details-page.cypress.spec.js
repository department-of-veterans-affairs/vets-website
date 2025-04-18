import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications List Page Pagination', () => {
  it('visits Medications list Page Pagination', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    const threadLength = 29;
    mockRxPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    cy.injectAxe();
    cy.axeCheck('main');
    site.verifyPaginationPrescriptionsDisplayed(1, 10, threadLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    site.verifyPaginationPrescriptionsDisplayed(11, 20, threadLength);
    site.loadVAPaginationPreviousPrescriptions(1, mockRxPageOne, 20);
    site.verifyPaginationPrescriptionsDisplayed(1, 10, threadLength);
  });
});
