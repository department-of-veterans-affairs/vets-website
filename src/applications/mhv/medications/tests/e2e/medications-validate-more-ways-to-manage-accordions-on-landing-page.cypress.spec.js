import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Accordions on Medications Landing Page', () => {
  it('visits more ways to manage accordion dropdown on landing page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    landingPage.clickExpandAccordionsOnMedicationsLandingPage();
    landingPage.verifyHowtoRenewPrescriptionsAccordionDropDown();
    landingPage.verifyHowToConfirmOrUpdateMailingAddressAccordionDropDown();
    landingPage.verifyHowToReviewAllergiesAndReactionsAccordionDropDown();
    landingPage.verifyHowToManageNotificationsAccordionDropDown();
  });
});
