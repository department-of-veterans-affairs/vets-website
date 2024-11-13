import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.json';

describe('Medications Refill Submit Success Message Refill Page', () => {
  it('visits Success Message on Refill page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.clickPrescriptionRefillCheckboxForSuccessfulRequest(
      prescription,
    );
    refillPage.clickRequestRefillButtonforSuccessfulRequests(
      prescription.data.attributes.prescriptionId,
      successRequest,
    );
    refillPage.verifyRefillRequestSuccessConfirmationMessage();
    refillPage.verifyMedicationRefillRequested(
      prescription.data.attributes.prescriptionName,
    );
    refillPage.verifyNetworkResponseForSuccessfulRefillRequest(
      prescription.data.attributes.prescriptionId,
    );
    refillPage.verifyRefillSuccessDescriptionText();
  });
});
