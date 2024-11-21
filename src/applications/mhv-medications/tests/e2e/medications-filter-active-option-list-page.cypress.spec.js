import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Active Filter Option', () => {
  it('visits Medications List Page Filter Option Active', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const url =
      '/my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Active,Active:%20Refill%20in%20Process,Active:%20Non-VA,Active:%20On%20hold,Active:%20Parked,Active:%20Submitted&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickfilterAccordionDropdownOnListPage();
    // listPage.verifyFilterOptionsOnListPage(
    //   'Active',
    //   'Active prescriptions and non-VA medications',
    // );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Active');

    listPage.clickFilterButtonOnAccordion(url);
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_ACTIVE_TEXT,
    );
  });
});
