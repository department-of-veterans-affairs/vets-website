import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescriptions-details-page-2.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications details Page Back Browser', () => {
  it('visits Medications Details Page Browser Back to List View', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    const threadLength = 29;
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    cy.injectAxe();
    cy.axeCheck('main');
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.go('back');
    site.verifyPaginationPrescriptionsDisplayed(11, 20, threadLength);
  });
});
