import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/parked-prescription-details.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import partialsuccessRequest from './fixtures/refill-partial-success.json';
import failedprescription from './fixtures/failed-request-prescription.json';

describe('Medications no partial success alert Refill Page', () => {
  it('visits no alert when nav back to refill page from list page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const numberOfCheckboxes = 3;
    const successAlert = 'Refills requested';
    const failedAlertText =
      'We’re sorry. There’s a problem with our system. We couldn’t submit these refill requests:';
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
    refillPage.verifyPartialSuccessAlertOnRefillPage();
    refillPage.loadRefillPage(prescriptions);
    refillPage.verifySuccessAlertTextDoesNotExistOnRefillPage(successAlert);
    refillPage.verifyFailedAlertTextDoesNotExistOnRefillPage(failedAlertText);
  });
});
