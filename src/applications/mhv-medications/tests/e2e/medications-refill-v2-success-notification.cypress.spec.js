import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.json';

describe('Medications Refill V2 Success Notification', () => {
  it('visits Refill Page V2 and verifies success notification links to in-progress medications', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.loginWithManagementImprovements();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitleV2();
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
    refillPage.verifyRefillSuccessDescriptionTextV2();
    refillPage.verifySuccessLinkTextV2();
    refillPage.verifySuccessLinkGoesToInProgressV2();
    refillPage.verifyMedicationNameBoldedInSuccessList(
      prescription.data.attributes.prescriptionName,
    );
  });
});
