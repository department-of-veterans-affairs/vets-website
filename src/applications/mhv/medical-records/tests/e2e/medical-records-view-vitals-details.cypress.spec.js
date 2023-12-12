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
    VitalsDetailsPage.verifyVitalsPageText('Vitals');
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

  it('Vitals Details Blood Pressure ', () => {
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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Vitals Details HeartRate', () => {
    // Click Vitals Page HeartRate  Link
    VitalsDetailsPage.clickBloodPressureLink(1);
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('December 25, 2004');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('185 /min');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('a bit fast');
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
    VitalsDetailsPage.clickBloodPressureLink(2);
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('August 9, 1999');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('185 /min');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('a bit fast');
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
  it('Vitals Details Pain', () => {
    // Click Vitals Page Pain Link
    VitalsDetailsPage.clickBloodPressureLink(3);
    // Verify Vital Date
    VitalsDetailsPage.verifyVitalDate('September 14, 2000');
    // Verify Vital Result
    VitalsDetailsPage.verifyVitalResult('185 /min');
    // Verify Vital Details Location
    VitalsDetailsPage.verifyVitalLocation('None noted');
    // Verify Vital Details  Provider Notes
    VitalsDetailsPage.verifyVitalProviderNotes('a bit fast');
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

  afterEach(() => {
    VitalsDetailsPage.clickBreadCrumbsLink(0);
  });
});
