import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import radiologyRecordsMhv from '../fixtures/radiologyRecordsMhv.json';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('View Radiology Details Page', () => {
    cy.reload();

    // I think the second parameter doesn't do anything right now...
    // "Radiology results are coming from an MHV (legacy) API, however,
    // that endpoint is not working for us yet so we are just using
    // mocked data for radiology (radiologyRecordsMhv.json). They are
    // being mixed in with the labs and tests records from FHIR when
    // viewed on the labs and tests list page."
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(
      0,
      radiologyRecordsMhv[16],
    );

    RadiologyDetailsPage.verifyTitle(radiologyRecordsMhv[16].procedureName);
    // why is the date value in radiologyRecordsMHV.json
    // a large number, like "eventDate": 976929600003, ???
    // can I test against the JSON or do I neeed to hard-code the date in the test?
    RadiologyDetailsPage.verifyDate('January 6, 1992');
    RadiologyDetailsPage.verifyRadiologyReason('None noted');

    // // Regex: replace \r\n line terminating characters, with spaces
    // // then eliminate multiple spaces
    // RadiologyDetailsPage.verifyRadiologyClinicalHistory(
    //   `${radiologyRecordsMhv[16].clinicalHistory
    //     .replace(/[\r\n]+/gm, ' ')
    //     .replace(/ +(?= )/g, '')}`,
    // );

    RadiologyDetailsPage.verifyRadiologyOrderedBy(
      radiologyRecordsMhv[16].requestingProvider,
    );

    RadiologyDetailsPage.verifyRadiologyImagingLocation(
      radiologyRecordsMhv[16].performingLocation,
    );

    RadiologyDetailsPage.verifyRadiologyImagingProvider(
      radiologyRecordsMhv[16].radiologist,
    );

    // Regex: replace \r\n line terminating characters, with spaces
    RadiologyDetailsPage.verifyRadiologyResults(
      radiologyRecordsMhv[16].impressionText
        .replace(/[\r\n]+/gm, ' ')
        .replace(/ +(?= )/g, ''),
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
