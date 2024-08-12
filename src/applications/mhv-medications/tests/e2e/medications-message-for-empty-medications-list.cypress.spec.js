import LandingPage from './pages/MedicationsLandingPage';
import MedicationsSite from './med_site/MedicationsSite';

describe('Medications Landing Page Empty Medications List', () => {
  it('visits Alert Message for Empty Medications List', () => {
    const site = new MedicationsSite();
    const landingPage = new LandingPage();

    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');

    landingPage.verifyEmptyMedicationsListMessageAlertOnLandingPage();
  });
});
