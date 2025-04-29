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
      'Prescriptions that just ran out of refills or became too old to refill (expired)',
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
  });
});
