import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page BackToTop', () => {
  it('visits Medications List Page BackToTop Button', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    cy.scrollTo(0, 1500);
    listPage.clickBackToTopButtonOnListPage();
    listPage.verifyMedicationsListPageTitleIsFocused();
  });
});
