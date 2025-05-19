import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import refillProcessed from './fixtures/active-refill-in-process-details.json';
import { Data } from './utils/constants';

describe('Medications Refill in Process and Tracking Alert', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  const detailsPage = new MedicationsDetailsPage();

  it('visits Medications Details Page Active Rx In Process Step Two Delay and Tracking Alert', () => {
    const cardNumber = 14;
    const updatedData = detailsPage.updateRefillAndCompleteDates(
      rxList,
      refillProcessed.data.attributes.prescriptionName,
      -10,
    );
    cy.intercept('GET', '/my_health/v1/prescriptions', updatedData).as(
      'updatedPrescriptions',
    );
    site.login();
    listPage.visitMedicationsListPageURL(updatedData);
    detailsPage.clickMedicationDetailsLink(refillProcessed, cardNumber);
    detailsPage.verifyRefillDelayAlertBannerOnDetailsPage(
      Data.DELAY_ALERT_DETAILS_BANNER,
    );
    detailsPage.verifyStepTwoHeaderOnDetailPageForRxInProcess(
      Data.STEP_TWO_PROCESS,
      Data.STEP_TWO_DELAY,
    );
    detailsPage.verifyTrackingAlertHeaderOnDetailsPage(Data.TRACKING_HEADING);
    detailsPage.verifyTrackingNumberForShippedPrescriptionOnDetailsPage(
      refillProcessed.data.attributes.trackingList[0].trackingNumber,
    );
    detailsPage.verifyPrescriptionInformationInTrackingAlertOnDetailsPage(
      Data.PRESCRIPTION_INFO_TRACKING,
      refillProcessed.data.attributes.prescriptionName,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('visits Medications Details Page Active Rx In Process Step Two and Tracking Alert', () => {
    const cardNumber = 14;
    const updatedData = detailsPage.updateRefillAndCompleteDates(
      rxList,
      refillProcessed.data.attributes.prescriptionName,
      10,
    );
    cy.intercept('GET', '/my_health/v1/prescriptions', updatedData).as(
      'updatedPrescriptions',
    );
    site.login();
    listPage.visitMedicationsListPageURL(updatedData);
    detailsPage.clickMedicationDetailsLink(refillProcessed, cardNumber);

    detailsPage.verifyStepTwoHeaderOnDetailPageForRxInProcess(
      Data.STEP_TWO_PROCESS,
      Data.STEP_TWO_PROCESS_HEADER,
    );
    detailsPage.verifyTrackingAlertHeaderOnDetailsPage(Data.TRACKING_HEADING);
    detailsPage.verifyTrackingNumberForShippedPrescriptionOnDetailsPage(
      refillProcessed.data.attributes.trackingList[0].trackingNumber,
    );
    detailsPage.verifyPrescriptionInformationInTrackingAlertOnDetailsPage(
      Data.PRESCRIPTION_INFO_TRACKING,
      refillProcessed.data.attributes.prescriptionName,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
