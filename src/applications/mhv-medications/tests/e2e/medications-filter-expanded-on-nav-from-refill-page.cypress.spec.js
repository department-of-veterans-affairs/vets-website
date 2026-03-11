import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications filter expanded on nav from refill page', () => {
  it('visits medications list page expanded filter after refill success', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listPage = new MedicationsListPage();

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
    listPage.verifyAllMedicationsRadioButtonIsChecked();
    listPage.verifyFilterButtonWhenAccordionExpanded();
  });
});
