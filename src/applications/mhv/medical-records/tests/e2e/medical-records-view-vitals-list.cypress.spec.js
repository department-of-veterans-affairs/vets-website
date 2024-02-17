import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
// import vitals from '../fixtures/vitals.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Visits Medical Records View Vitals List', () => {
    VitalsListPage.goToVitals();

    VitalsListPage.verifyVitalOnListPage(
      0,
      'Blood pressure',
      '130/70',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
