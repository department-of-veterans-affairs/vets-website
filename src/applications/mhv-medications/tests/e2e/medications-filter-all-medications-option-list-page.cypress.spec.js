import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page All Medications Filter', () => {
  it('visits Medications List Page Filter Option All Medications', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'All medications',
      'All medications in your VA medical records',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.verifyAllMedicationsRadioButtonIsChecked();
  });
});
