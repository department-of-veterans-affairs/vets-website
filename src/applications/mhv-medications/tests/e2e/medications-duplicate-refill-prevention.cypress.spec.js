import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/listOfPrescriptions.json';
import prescription from './fixtures/active-prescriptions-with-refills.json';
import successRequest from './fixtures/refill-success.json';

describe('Medications Duplicate Refill Prevention', () => {
  it('visits Medications Refill Page and prevents duplicate refill submissions', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');

    refillPage.verifyRefillPageTitle();

    // Select a prescription for refill using the page object method
    refillPage.clickPrescriptionRefillCheckboxForSuccessfulRequest(
      prescription,
    );

    // Submit the refill request using the page object method
    refillPage.clickRequestRefillButtonforSuccessfulRequests(
      prescription.data.attributes.prescriptionId,
      successRequest,
    );

    // Verify the successful refill message appears
    refillPage.verifyRefillRequestSuccessConfirmationMessage();

    // Verify network response was correct
    refillPage.verifyNetworkResponseForSuccessfulRefillRequest(
      prescription.data.attributes.prescriptionId,
    );
  });
});
