import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Paths } from './utils/constants';
import filterRx from './fixtures/filter-prescriptions.json';

describe('Medications List Page Filter Accordion Reset Button', () => {
  it('visits Medications List Page Reset Filter Button', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyLabelTextWhenFilterAccordionExpanded();
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterHeaderTextHasFocusafterExpanded();
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Active');

    listPage.clickFilterButtonOnAccordion(Paths.ACTIVE_FILTER, filterRx);
    listPage.clickResetFilterButtonOnFilterAccordionDropDown();
    listPage.verifyFilterAriaRegionText(
      'Filters cleared. Showing 1 - 10 of 29 medications, alphabetically by status',
    );
    listPage.verifyAllMedicationsRadioButtonIsChecked();
  });
});
