import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import radiologyRecordsMhv from './fixtures/labs-and-tests/radiologyRecordsMhv.json';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('View Radiology Details Page', () => {
    cy.reload();
    LabsAndTestsListPage.clickRadiologyDetailsLink(0);

    RadiologyDetailsPage.verifyTitle(radiologyRecordsMhv[11].procedureName);
    RadiologyDetailsPage.verifyDate(
      moment(radiologyRecordsMhv[11].eventDate).format('MMMM D, YYYY'),
    );

    RadiologyDetailsPage.verifyRadiologyReason('None noted');

    // Regex: replace \r\n line terminating characters, with spaces
    // then eliminate multiple spaces
    RadiologyDetailsPage.verifyRadiologyClinicalHistory(
      `${radiologyRecordsMhv[11].clinicalHistory
        .replace(/[\r\n]+/gm, ' ')
        .replace(/ +(?= )/g, '')
        .trim()}`,
    );

    RadiologyDetailsPage.verifyRadiologyOrderedBy(
      radiologyRecordsMhv[11].requestingProvider,
    );

    RadiologyDetailsPage.verifyRadiologyImagingLocation(
      radiologyRecordsMhv[11].performingLocation,
    );

    RadiologyDetailsPage.verifyRadiologyImagingProvider(
      radiologyRecordsMhv[11].radiologist,
    );

    // Regex: replace \r\n line terminating characters, with spaces
    RadiologyDetailsPage.verifyRadiologyResults(
      radiologyRecordsMhv[11].impressionText
        .replace(/[\r\n]+/gm, ' ')
        .replace(/ +(?= )/g, ''),
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
