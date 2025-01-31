import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';

describe('Medical Records View Vaccines', () => {
  it('Visits MR Vaccine List, Uses Back-To-Top Button', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.viewport(550, 750);
    cy.visit('my-health/medical-records/');
    VaccinesListPage.goToVaccines();
    cy.scrollTo(0, 1500);
    VaccinesListPage.clickBackToTopButtonOnListPage();
    VaccinesListPage.verifyVaccinesListPageTitleIsFocused();
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
