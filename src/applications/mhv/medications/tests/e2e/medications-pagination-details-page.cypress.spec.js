import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Pagination', () => {
  it('visits Medications list Page Pagination', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    cy.visit('my-health/about-medications');

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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    // cy.get('[href="/my-health/medications/"]').click();
    site.loadVAPaginationPrescriptions(1, mockRxPageOne);
    site.verifyPaginationPrescriptionsDisplayed(1, 20, threadLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    site.verifyPaginationPrescriptionsDisplayed(21, 29, threadLength);
    site.loadVAPaginationPreviousPrescriptions(1, mockRxPageOne, 20);
    site.verifyPaginationPrescriptionsDisplayed(1, 20, threadLength);
  });
});
