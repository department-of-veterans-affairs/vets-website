import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data, Paths } from './utils/constants';
import filterRx from './fixtures/filter-prescriptions.json';

describe('Medications List Page Filter Accordion Reset Button', () => {
  it('visits Medications List Page Reset Filter Button', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Active');

    listPage.clickFilterButtonOnAccordion(Paths.ACTIVE_FILTER, filterRx);
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_ACTIVE_TEXT,
    );
    listPage.clickResetFilterButtonOnFilterAccordionDropDown();
    listPage.verifyAllMedicationsRadioButtonIsChecked();
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_ALL_MEDICATIONS,
    );
    listPage.verifyFilterAriaRegionText(
      'Filters cleared. Showing all medications.',
    );
  });
});
