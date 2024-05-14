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
      'October', //  27, 2023, 7:00 a.m. PDT
    );

    VitalsListPage.verifyVitalOnListPage(
      1,
      'Heart rate',
      '70 beats per minute',
      'October',
    );

    VitalsListPage.verifyVitalOnListPage(
      2,
      'Breathing rate',
      '15 breaths per minute',
      'October',
    );

    VitalsListPage.verifyVitalOnListPage(
      3,
      'Blood oxygen level',
      '98%',
      'October',
    );

    VitalsListPage.verifyVitalOnListPage(4, 'Temperature', '99 °F', 'October');

    VitalsListPage.verifyVitalOnListPage(5, 'Weight', '185 pounds', 'October');

    VitalsListPage.verifyVitalOnListPage(6, 'Height', '70 inches', 'October');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
