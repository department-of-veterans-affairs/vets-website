import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Accordions on Medications Landing Page', () => {
  it('visits more ways to manage accordion dropdown on landing page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login();
    cy.visit('my-health/about-medications/');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.clickExpandAccordionsOnMedicationsLandingPage();
    landingPage.verifyHowtoRenewPrescriptionsAccordionDropDown();
    landingPage.verifyHowToConfirmOrUpdateMailingAddressAccordionDropDown();
    landingPage.verifyHowToReviewAllergiesAndReactionsAccordionDropDown();
    landingPage.verifyHowToManageNotificationsAccordionDropDown();
  });
});
