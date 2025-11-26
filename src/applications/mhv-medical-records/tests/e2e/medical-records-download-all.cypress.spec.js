import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import DownloadAllPage from './pages/DownloadAllPage';
import { currentDateAddSecondsForFileDownload } from '../../util/dateHelpers';

describe('Test download all page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    site.loadPage();
  });

  it('test download all feature', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // site.loadPage();

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

    // // Verify "valid year" error
    // DownloadAllPage.clearCustomStartYear();
    // DownloadAllPage.selectCustomStartYear('1895');
    // DownloadAllPage.blurCustomStartYear();
    // // Previously this error was FLAKY
    // DownloadAllPage.verifyErrorValidYear(
    //   'Please enter a year between 1900 and 2125',
    // );

    // Select valid dates, verify dates are selected correctly on the 2nd page
    DownloadAllPage.clearCustomStartYear();
    DownloadAllPage.selectCustomStartYear('2015');
    DownloadAllPage.clearCustomEndYear();
    DownloadAllPage.selectCustomEndYear('2024');
    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyDateRangeOnPageTwo(
      'January 12, 2015 to January 1, 2024',
    );
    DownloadAllPage.selectVaccinesCheckbox();
    DownloadAllPage.clickBackOnDownloadAllPage();

    // verify date range is still selected on the first page (retain selected info)
    DownloadAllPage.verifyDateRangeDropdown('custom');
    DownloadAllPage.verifyCustomStartMonth('1'); // value 1 is January
    DownloadAllPage.verifyCustomStartDay('12');
    DownloadAllPage.verifyCustomStartYear('2015');
    DownloadAllPage.verifyCustomEndMonth('1'); // value 1 is January
    DownloadAllPage.verifyCustomEndDay('1');
    DownloadAllPage.verifyCustomEndYear('2024');

    // verify vaccines checkbox is checked on 2nd page
    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyVaccinesCheckboxChecked();
    DownloadAllPage.interceptVaccinesOnDownloadAllPage();
    DownloadAllPage.interceptPatientOnDownloadAllPage();

    // Go to 3rd page, select record type
    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.clickPDFRadioButton();
    DownloadAllPage.clickBackOnDownloadAllPage3();
    DownloadAllPage.clickContinueOnDownloadAllPage();
    DownloadAllPage.verifyPDFRadioButtonChecked();

    DownloadAllPage.clickDownloadReport();
    DownloadAllPage.verifyDownloadStartedAlert();

    site.verifyDownloadedPdfFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      currentDateAddSecondsForFileDownload(1),
      '',
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
