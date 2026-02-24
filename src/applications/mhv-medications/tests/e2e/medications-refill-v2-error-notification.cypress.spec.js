import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/listOfPrescriptions.json';
import failedRequest from './fixtures/failed-request-prescription.json';
import failedRefill from './fixtures/refill-failure.json';
import { Data } from './utils/constants';

describe('Medications Refill V2 Error Notification', () => {
  it('visits Refill Page V2 and verifies error notification on failed refill', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.loginWithManagementImprovements();
    refillPage.loadRefillPageV2(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitleV2();
    refillPage.clickPrescriptionRefillCheckbox(failedRequest);
    refillPage.clickRequestRefillButtonForFailedRequest(
      failedRequest.data.attributes.prescriptionId,
      failedRefill,
    );
    refillPage.verifyFailedRequestMessageAlertOnRefillPage(
      Data.REFILL_REQUEST_ERROR_ALERT_TEXT,
    );
    refillPage.verifyFailedAlertTextExistsOnRefillPage(
      Data.FAILED_REQUEST_DESCRIPTION_TEXT,
      Data.FAILED_REQUEST_RETRY_TEXT,
    );
  });

  it('visits Refill Page V2 and verifies inline error when no prescription selected', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.loginWithManagementImprovements();
    refillPage.loadRefillPageV2(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitleV2();
    refillPage.clickRefillRequestButton();
    refillPage.verifyErrorMessageWhenRefillRequestWithoutSelectingPrescription();
  });
});
