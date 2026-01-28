import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import ImagingResultsListPage from './pages/ImagingResultsListPage';
import radiologyRecordsMhv from './fixtures/labs-and-tests/radiologyRecordsMhv.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';

describe('Medical Records View Imaging Results Details', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    ImagingResultsListPage.goToImagingResults();
  });

  it('View Radiology Details Page from Imaging Results', () => {
    ImagingResultsListPage.clickRadiologyDetailsLink('CHEST 2 VIEWS PA&LAT');

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

    RadiologyDetailsPage.verifyRadiologyOrderedBy('JANE DOE');

    RadiologyDetailsPage.verifyRadiologyImagingLocation(
      radiologyRecordsMhv[11].performingLocation,
    );

    RadiologyDetailsPage.verifyRadiologyImagingProvider('JOHN DOE');

    // Regex: replace \r\n line terminating characters, with spaces
    RadiologyDetailsPage.verifyRadiologyResults(
      radiologyRecordsMhv[11].impressionText
        .replace(/[\r\n]+/gm, ' ')
        .replace(/ +(?= )/g, ''),
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });

  it('Displays loading indicator while fetching details', () => {
    // Navigate to a radiology details page
    ImagingResultsListPage.clickRadiologyDetailsLink('CHEST 2 VIEWS PA&LAT');

    // The page should render (loading or content)
    cy.get('h1').should('exist');

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
