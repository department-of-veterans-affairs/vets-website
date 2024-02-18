import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Vitals Details Height', () => {
    VitalsListPage.goToVitals();
    // click vitals page height link
    VitalsListPage.clickLinkByRecordListItemIndex(6);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      'October 27, 2023, 7:00 a.m. PDT',
      '70 inches',
      'ADTP BURNETT',
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      'August 4, 2023, 7:08 a.m. PDT',
      '72 inches',
      '23 HOUR OBSERVATION',
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      'August 18, 2022, 1:29 p.m. PDT',
      '70 inches',
      'ADMISSIONS (LOC)',
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      'May 11, 2021, 7:20 a.m. PDT',
      '70 inches',
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
