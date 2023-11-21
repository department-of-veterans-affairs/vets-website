import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Sort Alphabetically By Status', () => {
  it('visits Medications list Page Sort Alphabetically By Status', () => {
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
        'link-name': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    site.loadVAPaginationPrescriptions(1, mockRxPageOne);
    site.verifyPaginationPrescriptionsDisplayed(1, 20, threadLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    listPage.selectSortAlphabeticallyByStatus();
    listPage.clickSortAlphabeticallyByStatus();
    listPage.verifyPaginationDisplayedforSortAlphabeticallyByStatus(
      1,
      20,
      threadLength,
    );
  });
});
