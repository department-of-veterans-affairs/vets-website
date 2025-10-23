import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import { Data } from './utils/constants';
import rxDetails from './fixtures/prescription-tracking-details.json';
import rxSubmitted from './fixtures/active-submitted-prescription-details.json';
import prescriptionList from './fixtures/active-single-refill-for-delay-alert.json';
import rxActive from './fixtures/active-prescriptions-with-refills.json';

describe.skip('Medications Refill Page Delay Alert', () => {
  beforeEach(() => {
    const site = new MedicationsSite();
    site.login();
  });
  it('visits Medications Refill Page Delay Alert', () => {
    const refillPage = new MedicationsRefillPage();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyRefillDelayAlertBannerOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxSubmitted.data.attributes.prescriptionName,
    );
  });
  it('visits Medications Refill Page Single RxDelay Alert', () => {
    const refillPage = new MedicationsRefillPage();
    refillPage.loadRefillPage(prescriptionList);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyRefillDelayAlertBannerOnRefillPage(
      Data.DELAY_ALERT_BANNER,
    );
    refillPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxActive.data.attributes.prescriptionName,
    );
  });
});
