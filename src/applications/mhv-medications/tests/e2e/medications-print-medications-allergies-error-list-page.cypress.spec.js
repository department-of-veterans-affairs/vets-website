import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Print Error No Allergies Network Call', () => {
  it('visits Print Medications List Error Message When No Allergies API Call', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsLinkWhenNoAllergiesAPICallFails();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.clickPrintThisPageOfTheListButtonOnListPage();
    listPage.verifyPrintErrorMessageForAllergiesAPICallFail();
  });
});
