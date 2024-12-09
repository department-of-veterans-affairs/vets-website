import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Cerner User Alert and Error Message for API Call Failure ', () => {
  it('visits Medications Landing Page Cerner User Alert and Refill Page Error', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const landingPage = new MedicationsLandingPage();
    site.cernerLoginRefillPageError();
    landingPage.visitLandingPageURL();
    refillPage.loadRefillPage();
    cy.injectAxe();
    cy.axeCheck('main');
    landingPage.verifyErroMessageforFailedAPICallListPage();
    landingPage.verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage();
  });
});
