import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionList from './fixtures/active-single-refill-for-delay-alert.json';
import { Data } from './utils/constants';
import rxDetails from './fixtures/active-prescriptions-with-refills.json';

describe.skip('Medications List Page Single Refill Alert', () => {
  it('visits Medications List Single Refill Alert', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(prescriptionList);
    listPage.verifyRefillDelayAlertBannerOnListPage(Data.DELAY_ALERT_BANNER);
    listPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
