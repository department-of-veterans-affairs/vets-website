import MedicationsSite from './med_site/MedicationsSite';

import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';
import rxDetails from './fixtures/prescription-tracking-details.json';
import rxSubmitted from './fixtures/active-submitted-prescription-details.json';

describe.skip('Medications List Page Delay Alert', () => {
  it('visits Medications List Page Delay Alert for Multiple Refills', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(prescriptionList);
    listPage.verifyRefillDelayAlertBannerOnListPage(Data.DELAY_ALERT_BANNER);
    listPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxDetails.data.attributes.prescriptionName,
    );
    listPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxSubmitted.data.attributes.prescriptionName,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
