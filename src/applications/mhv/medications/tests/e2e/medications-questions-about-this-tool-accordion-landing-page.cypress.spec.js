import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    cy.visit('my-health/about-medications/');
    site.login();
    landingPage.clickExpandAllAccordionButton();
    landingPage.verifyListMedicationsAndSuppliesAccordionDropDown();
    landingPage.verifyWhatTypeOfPrescriptionsAccordionDropDown();
    landingPage.verifyPrescriptionRefillRequestInformationAccordionDropDown();
    landingPage.verifyMoreQuestionsAccordionDropDown();
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
