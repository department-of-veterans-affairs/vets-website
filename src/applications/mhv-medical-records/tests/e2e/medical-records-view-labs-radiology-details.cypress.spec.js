import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import radiologyRecordsMhv from './fixtures/labs-and-tests/radiologyRecordsMhv.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('View Radiology Details Page', () => {
    LabsAndTestsListPage.clickRadiologyDetailsLink('CHEST 2 VIEWS PA&LAT');

    RadiologyDetailsPage.verifyTitle(radiologyRecordsMhv[11].procedureName);
    RadiologyDetailsPage.verifyDate(
      formatDateMonthDayCommaYear(radiologyRecordsMhv[11].eventDate),
    );

    RadiologyDetailsPage.verifyRadiologyReason('None recorded');

    // Regex: replace \r\n line terminating characters, with spaces
    // then eliminate multiple spaces
    RadiologyDetailsPage.verifyRadiologyClinicalHistory(
      `${radiologyRecordsMhv[11].clinicalHistory
        .replace(/[\r\n]+/gm, ' ')
        .replace(/ +(?= )/g, '')
        .trim()}`,
    );

    RadiologyDetailsPage.verifyRadiologyOrderedBy(
      // radiologyRecordsMhv[11].requestingProvider,
      'JANE DOE',
    );

    RadiologyDetailsPage.verifyRadiologyImagingLocation(
      radiologyRecordsMhv[11].performingLocation,
    );

    RadiologyDetailsPage.verifyRadiologyImagingProvider(
      // radiologyRecordsMhv[11].radiologist,
      'JOHN DOE',
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
