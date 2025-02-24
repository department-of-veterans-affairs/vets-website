import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe.skip('Medications List Page Filter Collapsed ', () => {
  it('visits Medications List Page Filter collpased after navigating away and back', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();

    listPage.clickfilterAccordionDropdownOnListPage();
    // listPage.verifyFilterOptionsOnListPage(
    //   'All medications',
    //   'All medications in your VA medical record',
    // );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    //  listPage.clickFilterRadioButtonOptionOnListPage('All medications');

    detailsPage.clickMedicationsLandingPageBreadcrumbsOnListPage();
    listPage.clickGotoMedicationsLink();
    listPage.verifyFilterCollapsedOnListPage();
  });
});
