import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Landing Page Cerner User', () => {
  it('visits cerner user my va health alert on about medications page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.cernerLogin();
    landingPage.visitLandingPageURL();
    landingPage.verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
