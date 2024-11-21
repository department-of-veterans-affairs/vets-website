import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Renewal Filter Option', () => {
  it('visits Medications List Page Filter Option Renewal', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const url =
      '/my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Active,Expired&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickfilterAccordionDropdownOnListPage();
    // listPage.verifyFilterOptionsOnListPage(
    //   'Renewal needed before refill',
    //   'Prescriptions that just ran out of refills or became too old to refill (expired)',
    // );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage(
      'Renewal needed before refill',
    );
    listPage.clickFilterButtonOnAccordion(url);
    // listPage.verifyFocusOnPaginationTextInformationOnListPage(
    //   Data.PAGINATION_TEXT,
    // );
  });
});
