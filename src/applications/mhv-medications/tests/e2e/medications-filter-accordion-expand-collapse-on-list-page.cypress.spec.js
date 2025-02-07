import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Filter Accordion', () => {
  it('visits Medications List Page Filter Accordion DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyLabelTextWhenFilterAccordionExpanded();
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterHeaderTextHasFocusafterExpanded();
    listPage.verifyFilterButtonWhenAccordionExpanded();
  });
});
