import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

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
    refillPage.verifyFailedRequestMessageAlertOnRefillPage();
    refillPage.verifyNetworkResponseForFailedRefillRequest(
      failedRequest.data.attributes.prescriptionId,
    );
    refillPage.clickGoToMedicationsListPage();
    refillPage.loadRefillPage(prescriptions);
    refillPage.verifyFailedAlertTextDoesNotExistOnRefillPage(failedAlertText);
  });
});
