import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import { Alerts, Data } from './utils/constants';
import rxDetails from './fixtures/prescription-tracking-details.json';
import rxSubmitted from './fixtures/active-submitted-prescription-details.json';
import rxActive from './fixtures/active-prescriptions-with-refills.json';
import successRequest from './fixtures/refill-success.json';
import failedRequest from './fixtures/failed-request-prescription.json';
import failedRefill from './fixtures/refill-failure.json';

describe.skip('Medications Refill Page Delay Alert Behavior', () => {
  const refillPage = new MedicationsRefillPage();
  beforeEach(() => {
    const site = new MedicationsSite();
    site.login();
    refillPage.loadRefillPage(prescriptions);
  });
  it('visits Medications Refill Request Success and Page Delay Alert', () => {
    refillPage.verifyRefillPageTitle();
    cy.injectAxe();
    cy.axeCheck('main');

    refillPage.verifyRefillDelayAlertBannerOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxSubmitted.data.attributes.prescriptionName,
    );
    refillPage.clickPrescriptionRefillCheckboxForSuccessfulRequest(rxActive);
    refillPage.clickRequestRefillButtonforSuccessfulRequests(
      rxActive.data.attributes.prescriptionId,
      successRequest,
    );
    refillPage.verifyRefillRequestSuccessConfirmationMessage();
    refillPage.verifyRefillDelayAlertNotVisibleOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    cy.reload();
    refillPage.verifyRefillDelayAlertBannerOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    refillPage.verifySuccessAlertTextDoesNotExistOnRefillPage(
      Alerts.REFILL_SUBMIT_SUCCESS,
    );
  });

  it('visits Medications Refill Request Failure and Page Delay Alert', () => {
    refillPage.verifyRefillPageTitle();
    cy.injectAxe();
    cy.axeCheck('main');

    refillPage.verifyRefillDelayAlertBannerOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxSubmitted.data.attributes.prescriptionName,
    );
    refillPage.clickPrescriptionRefillCheckbox(failedRequest);
    refillPage.clickRequestRefillButtonForFailedRequest(
      failedRequest.data.attributes.prescriptionId,
      failedRefill,
    );
    refillPage.verifyFailedRequestMessageAlertOnRefillPage(
      Data.REFILL_REQUEST_ERROR_ALERT_TEXT,
    );
    refillPage.verifyRefillDelayAlertNotVisibleOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    cy.reload();
    refillPage.verifyRefillDelayAlertBannerOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    refillPage.verifyFailedAlertTextDoesNotExistOnRefillPage(
      Alerts.REFILL_SUBMIT_FAILURE,
    );
  });
});
