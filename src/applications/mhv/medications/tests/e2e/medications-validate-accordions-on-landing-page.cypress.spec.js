import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Accordions on Medications Landing Page', () => {
  it.skip('visits accordions on landing page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login();
    cy.visit('my-health/about-medications/');

    landingPage.clickExpandAccordionsOnMedicationsLandingPage();
    landingPage.verifyListMedicationsAndSuppliesAccordionDropDown();
    landingPage.verifyWhatTypeOfPrescriptionsAccordionDropDown();
    landingPage.verifyPrescriptionRefillRequestInformationAccordionDropDown();
    landingPage.verifyMoreQuestionsAccordionDropDown();
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
