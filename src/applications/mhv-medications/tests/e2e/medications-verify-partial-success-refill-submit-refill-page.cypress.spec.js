import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/parked-prescription-details.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import partialsuccessRequest from './fixtures/refill-partial-success.json';
import failedprescription from './fixtures/failed-request-prescription.json';
import { Data } from './utils/constants';

describe('Medications Refill Submit  PartialSuccess Message Refill Page', () => {
  it('visits Partial Success Message on Refill page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const numberOfCheckboxes = 3;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();

    refillPage.clickSomeRefillCheckBoxesOnRefillPage(numberOfCheckboxes);
    refillPage.clickRequestRefillButtonforPartialSuccessfulRequests(
      prescription.data.attributes.prescriptionId,
      failedprescription.data.attributes.prescriptionId,
      partialsuccessRequest,
    );
    refillPage.verifyPartiallyFailedRequestMessageAlertOnRefillPage(
      Data.PARTIAL_FAILED_REQUEST_ALERT_TEXT,
    );
  });
});
