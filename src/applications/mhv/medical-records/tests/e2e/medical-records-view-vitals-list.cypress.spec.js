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

    VitalsListPage.verifyVitalOnListPage(
      1,
      'Heart rate',
      '70 beats per minute',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    VitalsListPage.verifyVitalOnListPage(
      2,
      'Breathing rate',
      '15 breaths per minute',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    VitalsListPage.verifyVitalOnListPage(
      3,
      'Blood oxygen level (pulse oximetry)',
      '98%',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    VitalsListPage.verifyVitalOnListPage(
      4,
      'Temperature',
      '99 °F',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    VitalsListPage.verifyVitalOnListPage(
      5,
      'Weight',
      '185 pounds',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    VitalsListPage.verifyVitalOnListPage(
      6,
      'Height',
      '70 inches',
      'October 27, 2023, 7:00 a.m. PDT',
      'ADTP BURNETT',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
