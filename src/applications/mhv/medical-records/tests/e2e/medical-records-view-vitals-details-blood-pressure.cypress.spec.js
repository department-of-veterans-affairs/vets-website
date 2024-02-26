import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Vitals Details Blood Pressure', () => {
    VitalsListPage.goToVitals();
    // click vitals page Blood Pressure Link
    VitalsListPage.clickLinkByRecordListItemIndex(0);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      'October', // 27, 2023, 7:00 a.m. PDT
      '130/70',
      'ADTP BURNETT',
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      'August', // 4, 2023, 7:08 a.m. PDT
      '120/80',
      '23 HOUR OBSERVATION',
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      'August', // 18, 2022, 1:29 p.m. PDT
      '90/60',
      'ADMISSIONS (LOC)',
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      'May', // 11, 2021, 7:20 a.m. PDT
      '125/80',
      'ADTP SCREENING',
      'None noted',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  // afterEach(() => {
  //   VitalsDetailsPage.clickBreadCrumbsLink(0);
  // });
});
