import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records/vitals');
  });

  it('Vitals Details Page title Text', () => {
    // Verify "Vitals" Page title Text

    // Verify "Vitals" Page title Text
    VitalsDetailsPage.verifyVitalsPageText('Vitals');

    // Click Vitals Page Blood Pressure Link
    VitalsDetailsPage.clickBloodPressureLink(0);

    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('October');

    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('130/70');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('ADTP BURNETT');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('None noted');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('Vitals Details Blood Pressure ', () => {
    // Click Vitals Page Blood Pressure Link
    VitalsDetailsPage.clickBloodPressureLink(0);
    // Verify Vital Details Page "Print or download" button
    VitalsDetailsPage.verifyPrintOrDownload('Print or download');
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('October');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('130/70');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('ADTP BURNETT');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('None noted');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Vitals Details Weight', () => {
    // Click Vitals Page Weight Link
    VitalsDetailsPage.clickWeightLink(5);
    // Verify Vital Details Page "Print or download" button
    VitalsDetailsPage.verifyPrintOrDownload('Print or download');
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('October');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('185 pounds');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('ADTP BURNETT');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('None noted');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  afterEach(() => {
    VitalsDetailsPage.clickBreadCrumbsLink(0);
  });
});
