import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import Vaccines from './accelerated/pages/Vaccines';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import oracleHealthUser from './accelerated/fixtures/user/oracle-health.json';
import vaccinesData from './accelerated/fixtures/vaccines/sample-lighthouse.json';
import vaccineDetailData from './accelerated/fixtures/vaccines/vaccine-detail.json';
import { currentDateAddSecondsForFileDownload } from '../../util/dateHelpers';

describe('Medical Records Labs and Tests List Page', () => {
  const site = new MedicalRecordsSite();
  const vaccineId = vaccineDetailData.data.id;

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles();
  });

  it('Vaccine Details page Toggle Menu button Print or download ', () => {
    // Set up intercepts for both list and detail views
    Vaccines.setIntercepts({ vaccinesData });
    Vaccines.setDetailIntercepts({ vaccineDetailData, vaccineId });

    site.loadPage();
    Vaccines.goToVaccinesPage();
    Vaccines.clickVaccineDetailsLink(0);

    // should display a toggle menu button
    Vaccines.verifyPrintOrDownload();
    Vaccines.clickPrintOrDownload();

    // should display print button for a Details "Print this Details"
    Vaccines.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    VaccineDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    VaccineDetailsPage.verifyDownloadTextFile();

    VaccineDetailsPage.clickDownloadPDFFile();
    site.verifyDownloadedPdfFile(
      'VA-labs-and-tests-Details-Mhvtp',
      currentDateAddSecondsForFileDownload(1),
      '',
    );

    VaccineDetailsPage.clickPrintOrDownload();
    VaccineDetailsPage.clickDownloadTxtFile();
    site.verifyDownloadedTxtFile(
      'VA-labs-and-tests-details-Safari-Mhvtp',
      currentDateAddSecondsForFileDownload(1),
      '',
    );
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
