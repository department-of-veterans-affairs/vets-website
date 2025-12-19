import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Paths } from './utils/constants';
import requestedRx from './fixtures/filter-prescriptions.json';

describe('Medications List Page Recently Requested Filter Option', () => {
  it('visits Medications List Page Filter Option Recently Requested', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'Recently requested',
      'Refill requests in process or shipped in the last 15 days',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Recently requested');
    listPage.clickFilterButtonOnAccordion(
      Paths.INTERCEPT.RECENTLY_REQUESTED_FILTER_LIST,
      requestedRx,
    );
    listPage.verifyFilterAriaRegionText('Filter applied: Recently requested.');
    listPage.verifyFilterAriaRegionText(
      'Showing 1 - 10 of 29  recently requested medications, alphabetically by status',
    );
  });
});
