import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Landing Page accordion', () => {
  it('visits Medications landing Questions About this Tool Accordion', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.clickExpandAllAccordionButton();
    landingPage.verifyListMedicationsAndSuppliesAccordionDropDown();
    landingPage.verifyWhatTypeOfPrescriptionsAccordionDropDown();
    landingPage.verifyPrescriptionRefillRequestInformationAccordionDropDown();
    landingPage.verifyMoreQuestionsAccordionDropDown();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
