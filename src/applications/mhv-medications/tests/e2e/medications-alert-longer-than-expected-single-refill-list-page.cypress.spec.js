import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionList from './fixtures/active-single-refill-for-delay-alert.json';
import { Data } from './utils/constants';
import rxDetails from './fixtures/active-prescriptions-with-refills.json';

describe('Medications List Page Single Refill Alert', () => {
  it('visits Medications List Single Refill Alert', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(prescriptionList);
    listPage.verifyRefillDelayAlertBannerOnListPage(Data.DELAY_ALERT_BANNER);
    listPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
