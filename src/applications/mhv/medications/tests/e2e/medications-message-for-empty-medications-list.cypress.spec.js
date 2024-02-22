import LandingPage from './pages/MedicationsLandingPage';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Landing Page Empty Medications List', () => {
  it('visits Alert Message for Empty Medications List', () => {
    const site = new MedicationsSite();
    const landingPage = new LandingPage();
    const listPage = new MedicationsListPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLinkforEmptyMedicationsList();
    landingPage.verifyEmptyMedicationsListMessageAlertOnLandingPage();
  });
});
