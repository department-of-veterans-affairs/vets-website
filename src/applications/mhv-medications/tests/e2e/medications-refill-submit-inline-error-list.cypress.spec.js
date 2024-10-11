import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

import failedRequest from './fixtures/failed-request-prescription.json';
import failedRefill from './fixtures/refill-failure.json';

describe('Medications Refill Submit Error Message List Page', () => {
  it('visits Error Message on list page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

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
  });
});
