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

  it('Navigate to MHV Classic to view their Radiology Images', () => {
    LabsAndTestsListPage.loadVAPaginationNext();
    // I think the second parameter doesn't do anything in this case...
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[2]);

    RadiologyDetailsPage.verifyTitle(radiologyRecordsMhv[2].procedureName);
    // why is the date value in radiologyRecordsMHV.json
    // a large number, like "eventDate": 976929600003, ???
    // can I test against the JSON or do I neeed to hard-code the date in the test?
    RadiologyDetailsPage.verifyDate('December 15, 2000');
    RadiologyDetailsPage.verifyRadiologyReason('None noted');

    // Regex: replace \r\n line terminating characters, with spaces
    // then eliminate multiple spaces
    RadiologyDetailsPage.verifyRadiologyClinicalHistory(
      `${radiologyRecordsMhv[2].clinicalHistory
        .replace(/[\r\n]+/gm, ' ')
        .replace(/ +(?= )/g, '')}`,
    );

    RadiologyDetailsPage.verifyRadiologyOrderedBy(
      radiologyRecordsMhv[2].requestingProvider, // 'DOE, JOHN A'
    );

    RadiologyDetailsPage.verifyRadiologyImagingLocation(
      radiologyRecordsMhv[2].performingLocation,
    );

    RadiologyDetailsPage.verifyRadiologyImagingProvider(
      radiologyRecordsMhv[2].radiologist,
    );

    // Regex: replace \r\n line terminating characters, with spaces
    RadiologyDetailsPage.verifyRadiologyResults(
      radiologyRecordsMhv[2].impressionText.replace(/[\r\n]+/gm, ' '),
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
