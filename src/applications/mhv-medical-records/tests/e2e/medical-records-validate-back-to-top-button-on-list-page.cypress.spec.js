import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import Vaccines from './accelerated/pages/Vaccines';
import oracleHealthUser from './accelerated/fixtures/user/oracle-health.json';

describe('Medical Records View Vaccines', () => {
  it('Visits MR Vaccine List, Uses Back-To-Top Button', () => {
    const site = new MedicalRecordsSite();

    site.login(oracleHealthUser, false);

    cy.viewport(550, 750);
    cy.visit('my-health/medical-records/');
    Vaccines.goToVaccinesPage();
    cy.scrollTo(0, 1500);
    Vaccines.clickBackToTopButtonOnListPage();
    Vaccines.verifyVaccinesListPageTitleIsFocused();
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
