import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records/vitals');
  });

  it('Vitals Details Blood Pressure', () => {
    // Click Vitals Page Blood Pressure Link
    VitalsDetailsPage.clickLinkByRecordListItemIndex(0);
    // Verify First Reading
    VitalsDetailsPage.verifyBloodPressureReadingByIndex(
      0,
      'October 27, 2023, 7:00 a.m. PDT',
      '130/70',
      'ADTP BURNETT',
      'None noted',
    );

    // // Verify Vital Date
    // VitalsDetailsPage.verifyVitalDate('December 25, 2004 12:00 a.m.');
    // // Verify Vital Result
    // VitalsDetailsPage.verifyVitalResult('185 /min');
    // // Verify Vital Details Location
    // VitalsDetailsPage.verifyVitalLocation('None noted');
    // // Verify Vital Details  Provider Notes
    // VitalsDetailsPage.verifyVitalProviderNotes('a bit fast');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  //   afterEach(() => {
  //     VitalsDetailsPage.clickBreadCrumbsLink(0);
  //   });
});
