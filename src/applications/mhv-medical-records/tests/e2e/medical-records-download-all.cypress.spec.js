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

    DownloadAllPage.clickContinueOnDateSelectionPage();

    DownloadAllPage.verifyErrorValidDateRange(
      'Please select a valid date range.',
    );

    DownloadAllPage.selectDateRangeDropdown('Custom');

    DownloadAllPage.selectCustomStartMonth('January');

    DownloadAllPage.selectCustomStartDay('12');

    DownloadAllPage.selectCustomStartYear('2024');

    DownloadAllPage.selectCustomEndMonth('January');

    DownloadAllPage.selectCustomEndDay('1');

    DownloadAllPage.selectCustomEndYear('2016');

    DownloadAllPage.clickContinueOnDateSelectionPage();

    DownloadAllPage.verifyErrorStartDateGreaterThanEnd(
      'Start date cannot be greater than end date',
    );

    // DownloadAllPage.selectDateRangeDropdown('Last 3 months');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
