import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications List Page Sort Alphabetically By Name', () => {
  it('visits Medications list Page Sort Alphabetically By Name', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();

    site.verifyPaginationPrescriptionsDisplayed(1, 20, listLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    listPage.selectSortDropDownOption('Alphabetically by name');
    listPage.clickSortAlphabeticallyByName();
    listPage.verifyPaginationDisplayedforSortAlphabeticallyByName(
      1,
      20,
      listLength,
    );
  });
});
