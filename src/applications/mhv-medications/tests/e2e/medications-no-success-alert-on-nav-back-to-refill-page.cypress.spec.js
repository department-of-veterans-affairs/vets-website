import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.json';

describe('Medications no alert when navigate back to refill page', () => {
  it('visits refill page from medications list page after refill request', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const successAlert = 'Refills requested';
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
    refillPage.loadRefillPage(prescriptions);
    refillPage.verifySuccessAlertTextDoesNotExistOnRefillPage(successAlert);
  });
});
