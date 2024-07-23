import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import labsAndTests from '../fixtures/labsAndTests.json';
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
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0, labsAndTests.entry[2]);

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
