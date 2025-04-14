import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ConditionsListPage from './pages/ConditionsListPage';

describe('Medical Records View Conditions', () => {
  it('Visits Medical Records View Conditions List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // cy.visit('my-health/medical-records/conditions');
    ConditionsListPage.gotoConditionsListPage();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
