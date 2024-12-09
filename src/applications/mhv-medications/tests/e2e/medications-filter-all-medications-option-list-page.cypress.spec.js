import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page All Medications Filter', () => {
  it('visits Medications List Page Filter Option All Medications', () => {
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
      'All medications',
      'All medications in your VA medical records',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();

    listPage.verifyAllMedicationsRadioButtonIsChecked();
  });
});
