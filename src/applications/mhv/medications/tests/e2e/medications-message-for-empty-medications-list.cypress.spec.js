import LandingPage from './pages/MedicationsLandingPage';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Landing Page Empty Medications List', () => {
  it('visits Alert Message for Empty Medications List', () => {
    const site = new MedicationsSite();
    const landingPage = new LandingPage();
    const listPage = new MedicationsListPage();
    cy.visit('my-health/about-medications/');
    site.login();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLinkforEmptyMedicationsList();
    landingPage.verifyEmptyMedicationsListMessageAlertOnLandingPage();
  });
});
