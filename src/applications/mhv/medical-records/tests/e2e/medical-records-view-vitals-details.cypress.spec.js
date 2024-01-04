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
    VitalsDetailsPage.verifyVitalDate('September 24, 2004');

    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('126/70');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
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
    VitalsDetailsPage.verifyVitalDate('September 24, 2004');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('126/70');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
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
    VitalsDetailsPage.clickWeightLink(2);
    // Verify Vital Details Page "Print or download" button
    VitalsDetailsPage.verifyPrintOrDownload('Print or download');
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('August 9, 1999');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('150.4 [lb_av]');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('PCT_O');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('Here is a provider note');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('Vitals Details Pain', () => {
    // Click Vitals Page Pain Link
    VitalsDetailsPage.clickPainLink(3);
    // Verify Vital Details Page "Print or download" button
    VitalsDetailsPage.verifyPrintOrDownload('Print or download');
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('September 14, 2000');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('0 undefined');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('ZZZHEMATOLOGY II');
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
