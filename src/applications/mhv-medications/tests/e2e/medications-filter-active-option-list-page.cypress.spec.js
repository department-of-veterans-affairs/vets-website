import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data, Paths } from './utils/constants';
import filterRx from './fixtures/filter-prescriptions.json';

describe('Medications List Page Active Filter Option', () => {
  it('visits Medications List Page Filter Option Active', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'Active',
      'Active prescriptions and non-VA medications',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Active');

    listPage.clickFilterButtonOnAccordion(Paths.ACTIVE_FILTER, filterRx);
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_ACTIVE_TEXT,
    );
    listPage.verifyFilterAriaRegionText('Filter applied: Active.');
  });
});
