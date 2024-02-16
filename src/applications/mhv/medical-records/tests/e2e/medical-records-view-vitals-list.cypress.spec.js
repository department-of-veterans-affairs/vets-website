import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
// import vitals from '../fixtures/vitals.json';

describe('Medical Records View Vitals', () => {
  it('Visits Medical Records View Vitals List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');
    VitalsListPage.goToVitals();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
