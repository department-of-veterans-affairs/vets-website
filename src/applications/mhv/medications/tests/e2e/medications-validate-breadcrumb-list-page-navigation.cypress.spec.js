import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionDetails from './fixtures/prescription-details-page2.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe.skip('Medications Breadcrumb Navigation To List Page', () => {
  it('visits Medications Breadcrumb Link to List Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
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
    listPage.clickGotoMedicationsLink();
    site.verifyPaginationPrescriptionsDisplayed(1, 20, listLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    site.verifyPaginationPrescriptionsDisplayed(21, 29, listLength);
    detailsPage.clickMedicationHistoryAndDetailsLink(prescriptionDetails);
    detailsPage.clickMedicationsListPageTwoBreadcrumbsOnDetailsPage();
    listPage.verifyNavigationToListPageTwoAfterClickingBreadcrumbMedications(
      21,
      29,
      listLength,
    );
  });
});
