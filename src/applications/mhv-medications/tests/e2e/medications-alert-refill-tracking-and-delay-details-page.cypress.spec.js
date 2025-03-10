import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';
import rxDetails from './fixtures/active-submitted-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Delay Alert and Tracking', () => {
  it('visits Medications Details Page Delay Alert and Tracking', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 4;
    site.login();
    listPage.visitMedicationsListPageURL(prescriptionList);
    detailsPage.clickMedicationDetailsLink(rxDetails, cardNumber);
    detailsPage.verifyCheckStatusHeaderTextOnDetailsPage(
      Data.CHECK_STATUS_HEADER,
    );
    detailsPage.verifyRefillDelayAlertBannerOnDetailsPage(
      Data.DELAY_ALERT_DETAILS_BANNER,
    );
    detailsPage.verifyTrackingForSubmittedRefillOnDetailsPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
