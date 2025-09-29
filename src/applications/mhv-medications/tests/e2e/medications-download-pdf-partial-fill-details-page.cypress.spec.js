import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import partialRxDetails from './fixtures/partial-prescription-details.json';
import partialRxList from './fixtures/partial-refills-med-list.json';
import { Data } from './utils/constants';

describe('Medications Partial Fill Details Page PDF Download', () => {
  it('visits Medications Details Page with Partial Fill and Downloads PDF', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 2;

    site.login();
    listPage.visitMedicationsListPageURL(partialRxList);
    detailsPage.clickMedicationDetailsLink(partialRxDetails, cardNumber);

    // Verify partial fill content is displayed before download
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyRefillAccordionHeaderForPartialFillOnDetailsPage(
      'Partial fill',
      Data.DATE_EMPTY,
    );
    detailsPage.verifyPartialFillTextInRefillAccordionOnDetailsPage(
      Data.PARTIAL_FILL_TEXT,
    );
    detailsPage.verifyQuantityForPartialFillOnDetailsPage(Data.QUANTITY_EMPTY);

    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage();
    detailsPage.verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage();
    detailsPage.clickDownloadMedicationDetailsAsPdfOnDetailsPage();

    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    listPage.verifyFocusOnDownloadAlertSuccessBanner();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
