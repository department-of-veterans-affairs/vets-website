import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.json';

describe('Medications Refill Success Alert Message Link', () => {
  it('visits Medications List Link on Success Alert', () => {
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
    refillPage.clickMedicationsListPageLinkOnRefillSuccessAlertOnRefillsPage();
  });
});
