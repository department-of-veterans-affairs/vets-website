import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/listOfPrescriptions.json';
import successRequest from './fixtures/refill-success.v2.json';

describe('Medications Refill Success Alert Message Link (v2)', () => {
  beforeEach(() => {
    const site = new MedicationsSite();

    cy.intercept('GET', `my_health/v1/prescriptions/*`, () => {
      // fail the test if v1 endpoint is called
      throw new Error(
        'v1 endpoint should not be called when accelerating medications',
      );
    });

    // Login with accelerated medications enabled (which includes the Cerner pilot toggle)
    site.login(true, false, true);
  });

  it('visits Medications List Link on Success Alert with v2 endpoint', () => {
    const refillPage = new MedicationsRefillPage();
    refillPage.loadRefillPage(prescriptions, 'my_health/v2');
    cy.injectAxeThenAxeCheck();
    refillPage.verifyRefillPageTitle();

    refillPage.clickPrescriptionRefillCheckboxForSuccessfulRequestV2();

    refillPage.clickRequestRefillButtonForSuccessfulRequestsV2(successRequest);

    refillPage.verifyRefillRequestSuccessConfirmationMessage();
  });
});
