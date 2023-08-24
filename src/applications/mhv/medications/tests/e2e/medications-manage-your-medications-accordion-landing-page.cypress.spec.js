import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications More Ways to Manage Your Medications Accordion', () => {
  it('visits more ways to manage your medications accordion', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    cy.visit('my-health/medications/');
    site.login();
    landingPage.clickMoreWaysToManageYourMedicationsAccordionExpandButton();
    landingPage.verifyHowtoRenewPrescriptionsAccordionDropDown();
    landingPage.verifyHowToConfirmOrUpdateMailingAddressAccordionDropDown();
    landingPage.verifyHowToReviewAllergiesAndReactionsAccordionDropDown();
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
  });
});
