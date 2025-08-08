import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';
import rxSubmitted from './fixtures/active-submitted-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe.skip('Medications Details Page Submitted Rx Progress Tracker', () => {
  it('visits Medications Details Page Submitted Rx Progress No Tracking Info', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(prescriptionList);
    listPage.verifyRefillDelayAlertBannerOnListPage(Data.DELAY_ALERT_BANNER);
    listPage.verifyRefillDetailsLinkVisibleOnDelayAlertBanner(
      rxSubmitted.data.attributes.prescriptionName,
    );
    listPage.clickMedicationsDetailsLinkOnDelayAlert(
      rxSubmitted.data.attributes.prescriptionId,
      rxSubmitted,
    );
    detailsPage.verifyRefillDelayAlertBannerOnDetailsPage(
      Data.DELAY_ALERT_DETAILS_BANNER,
    );
    detailsPage.verifyPharmacyPhoneNumberOnDelayAlert(
      rxSubmitted.data.attributes.dialCmopDivisionPhone,
    );
    detailsPage.verifySubmittedStatusDropDownDefinition();
    detailsPage.verifyProcessStepOneHeaderOnDetailsPage(
      Data.STEP_ONE_SUBMITTED,
      Data.STEP_ONE_DATE_TEXT,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
