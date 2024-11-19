import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import { Paths } from './utils/constants';

describe('Medications List Page Active Filter Option', () => {
  it('visits Medications List Page Filter Option Active', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'Active',
      'Active prescriptions and non-VA medications',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage(
      'Active',
      Paths.INTERCEPT.ACTIVE_FILTER_LIST,
    );

    listPage.clickFilterButtonOnAccordion();
    // listPage.verifyFocusOnPaginationTextInformationOnListPage(
    //   Data.PAGINATION_TEXT,
    // );
    // listPage.verifyNameOfFirstRxOnMedicationsList('active');
  });
});
