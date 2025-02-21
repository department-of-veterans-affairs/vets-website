import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';
import rxDetails from './fixtures/prescription-tracking-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Delay Alert and Tracking', () => {
  it('visits Medications Details Page Delay Alert and Tracking', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(prescriptionList);
    listPage.verifyRefillDelayAlertBannerOnListPage(Data.DELAY_ALERT_BANNER);
    listPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    listPage.clickMedicationsDetailsLinkOnDelayAlert(
      rxDetails.data.attributes.prescriptionId,
      rxDetails,
    );
    detailsPage.verifyCheckStatusHeaderTextOnDetailsPage(
      Data.CHECK_STATUS_HEADER,
    );
    detailsPage.verifyRefillDelayAlertBannerOnDetailsPage(
      Data.DELAY_ALERT_DETAILS_BANNER,
    );
    detailsPage.verifyPrescriptionTrackingInformation();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
