import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Non-Active Filter Option', () => {
  it('visits Medications List Page Filter Option Non-Active', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const url =
      'my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Discontinued,Expired,Transferred,Unknown&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickfilterAccordionDropdownOnListPage();
    // listPage.verifyFilterOptionsOnListPage(
    //   'Non-active',
    //   'Prescriptions that are discontinued, expired, or have an unkown status',
    // );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Non-active');
    listPage.clickFilterButtonOnAccordion(url);
    listPage.verifyFocusOnPaginationTextInformationOnListPage(
      Data.PAGINATION_NON_ACTIVE,
    );
  });
});
