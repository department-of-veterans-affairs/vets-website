import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Print Error No Allergies Network Call', () => {
  it('visits Print Medications List Error Message When No Allergies API Call', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    // cy.visit('my-health/about-medications/');
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGoToMedicationsLinkWhenNoAllergiesAPICallFails();
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.clickPrintThisPageOfTheListButtonOnListPage();
    listPage.verifyPrintErrorMessageForAllergiesAPICallFail();
  });
});
