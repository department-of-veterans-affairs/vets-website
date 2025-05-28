import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import { Data } from './utils/constants';
import failedRequest from './fixtures/failed-request-prescription.json';
import failedRefill from './fixtures/refill-failure.json';

describe('Medications no error alert on refill page', () => {
  it('visits no error alert when nav back to refill page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const failedAlertText =
      'We’re sorry. There’s a problem with our system. We couldn’t submit these refill requests:';
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
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
    refillPage.verifyNetworkResponseForFailedRefillRequest(
      failedRequest.data.attributes.prescriptionId,
    );
    refillPage.clickGoToMedicationsListPage();
    refillPage.loadRefillPage(prescriptions);
    refillPage.verifyFailedAlertTextDoesNotExistOnRefillPage(failedAlertText);
  });
});
