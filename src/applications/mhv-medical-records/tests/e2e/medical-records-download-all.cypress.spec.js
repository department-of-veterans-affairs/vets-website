import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import DownloadAllPage from './pages/DownloadAllPage';

describe('Test download all page', () => {
  it('test download all feature', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();
    DownloadReportsPage.goToDownloadAllPage();

    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyErrorValidDateRange(
      'Please select a valid date range.',
    );

    DownloadAllPage.selectDateRangeDropdown('Custom');
    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyValidStartDateError('Please enter a complete date');
    DownloadAllPage.selectCustomStartMonth('January');
    DownloadAllPage.selectCustomStartDay('12');
    DownloadAllPage.selectCustomStartYear('2024');

    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyValidEndDateError('Please enter a complete date');

    // Verify "start date greater than end date" error
    DownloadAllPage.selectCustomEndMonth('January');
    DownloadAllPage.selectCustomEndDay('1');
    DownloadAllPage.selectCustomEndYear('2016');
    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyErrorStartDateGreaterThanEnd(
      'End date must be on or after start date.',
    );

    // Verify "valid year" error
    DownloadAllPage.clearCustomStartYear();
    DownloadAllPage.selectCustomStartYear('1895');
    DownloadAllPage.blurCustomStartYear();
    DownloadAllPage.verifyErrorValidYear(
      'Please enter a year between 1900 and 2125',
    );

    DownloadAllPage.selectDateRangeDropdown('All time');
    DownloadAllPage.clickContinueOnDownloadAllPage();

    DownloadAllPage.selectVaccinesCheckbox();
    DownloadAllPage.interceptVaccinesOnDownloadAllPage();
    DownloadAllPage.interceptPatientOnDownloadAllPage();

    DownloadAllPage.clickContinueOnDownloadAllPage();

    DownloadAllPage.clickPDFRadioButton();
    DownloadAllPage.clickDownloadReport();
    DownloadAllPage.verifyDownloadStartedAlert();
    site.verifyDownloadedPdfFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      moment(),
      '',
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
