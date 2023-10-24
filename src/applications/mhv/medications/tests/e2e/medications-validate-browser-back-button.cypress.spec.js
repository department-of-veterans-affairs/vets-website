import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescriptions-details-page-2.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications List Page Pagination', () => {
  it('visits Medications list Page Pagination', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    cy.visit('my-health/about-medications');
    site.login();
    const threadLength = 29;
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails);
    cy.go('back');
    site.verifyPaginationPrescriptionsDisplayed(21, 29, threadLength);
  });
});
