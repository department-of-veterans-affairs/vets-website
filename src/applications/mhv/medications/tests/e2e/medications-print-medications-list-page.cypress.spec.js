import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Print List', () => {
  it.skip('visits Print Medications List', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    cy.visit('my-health/about-medications/');
    site.login();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyPrintMedicationsListEnabledOnListPage();
  });
});
