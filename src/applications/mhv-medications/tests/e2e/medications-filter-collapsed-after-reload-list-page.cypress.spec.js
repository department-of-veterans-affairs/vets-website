import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Filter Accordion Collapsed', () => {
  it('visits Medications List Page Filter Accordion Collapsed after Reload', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyLabelTextWhenFilterAccordionExpanded();
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterHeaderTextHasFocusafterExpanded();
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('All medications');
    cy.reload();
    listPage.verifyFilterCollapsedOnListPage();
  });
});
