import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data, Paths } from './utils/constants';
import renewRx from './fixtures/filter-prescriptions.json';

describe('Medications List Page Renewal Filter Option', () => {
  it('visits Medications List Page Filter Option Renewal', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'Renewal needed before refill',
      'Prescriptions that need renewal (no refills left or expired in last 120 days)',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage(
      'Renewal needed before refill',
    );
    listPage.clickFilterButtonOnAccordion(
      Paths.INTERCEPT.RENEW_FILTER_LIST,
      renewRx,
    );
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_RENEW,
    );
    listPage.verifyFilterAriaRegionText(
      'Filter applied: Renewal needed before refill.',
    );
  });
});
