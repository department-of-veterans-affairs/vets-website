import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescription from './fixtures/active-prescriptions-with-refills.json';

describe('Medications Refill Submit Error Message List Page', () => {
  it('visits Error Message on list page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.clickPrescriptionRefillCheckbox(prescription);
    refillPage.clickRefillRequestButton();
    refillPage.verifyFailedRequestMessageAlertOnRefillPage();
  });
});
