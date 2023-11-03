import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Renew Rx Link', () => {
  it('visits Medications List Page Learn How To Renew Prescription Link', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    cy.visit('my-health/about-medications/');

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
    listPage.clickGotoMedicationsLink();
    listPage.verifyLearnHowToRenewPrescriptionsLinkExists();
    listPage.clickLearnHowToRenewPrescriptionsLink();
    landingPage.verifyHowtoRenewPrescriptionsAccordionDropDown();
  });
});
