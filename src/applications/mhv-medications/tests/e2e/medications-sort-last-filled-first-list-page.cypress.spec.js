import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';
import { Paths } from './utils/constants';

describe('Medications List Page Sort By Last Filled First', () => {
  it('visits Medications list Page Sort ByLast Filled First', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
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
    // site.loadVAPaginationPrescriptions(1, mockRxPageOne);
    site.verifyPaginationPrescriptionsDisplayed(1, 10, listLength);
    // site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    listPage.selectSortDropDownOption(
      'Last filled first',
      Paths.SORT_BY_LAST_FILLED,
    );
    listPage.loadRxAfterSortLastFilledFirst();
    listPage.verifyPaginationDisplayedforSortLastFilledFirst(1, 10, listLength);
  });
});
