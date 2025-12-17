import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionDetails from './fixtures/prescription-details-page2.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Breadcrumb Navigation To List Page', () => {
  it('visits Medications Breadcrumb Link to List Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    const listLength = 29;
    mockRxPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = listLength;
    });
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = listLength;
    });

    cy.injectAxe();
    cy.axeCheck('main');
    site.verifyPaginationPrescriptionsDisplayed(1, 10, listLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    site.verifyPaginationPrescriptionsDisplayed(11, 20, listLength);
    detailsPage.clickMedicationHistoryAndDetailsLink(prescriptionDetails);
    detailsPage.clickMedicationsListPageTwoBreadcrumbsOnDetailsPageAndVerifyNavigation(
      11,
      20,
      listLength,
    );
  });
});
