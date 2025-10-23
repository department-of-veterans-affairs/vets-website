import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data, Paths } from './utils/constants';

import nonActiveRx from './fixtures/filter-non-active-prescriptions.json';

describe('Medications List Page Non-Active Filter Option', () => {
  it('visits Medications List Page Filter Option Non-Active', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'Non-active',
      'Prescriptions that are discontinued, expired, or have an unknown status',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Non-active');
    listPage.clickFilterButtonOnAccordion(
      Paths.INTERCEPT.NON_ACTIVE_FILTER_LIST,
      nonActiveRx,
    );
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_NON_ACTIVE,
    );
    listPage.verifyFilterAriaRegionText('Filter applied: Non-active.');
  });
});
