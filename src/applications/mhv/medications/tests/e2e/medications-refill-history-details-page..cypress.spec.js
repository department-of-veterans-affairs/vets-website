import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import refillHistoryDetails from './fixtures/prescription-refill-history-details.json';

describe('Medications Refill History on Details Page', () => {
  it('visits prescription refill history on details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(refillHistoryDetails);
    detailsPage.verifyRefillHistoryHeaderOnDetailsPage();
    detailsPage.verifyFirstRefillHeaderTextOnDetailsPage();
    detailsPage.verifyFillDateFieldOnDetailsPage();
    detailsPage.verifyShippedOnDateFieldOnDetailsPage();
    detailsPage.verifyImageOfMedicationFieldOnDetailsPage();
    detailsPage.verifyRxFilledByPharmacyDateOnDetailsPage(
      refillHistoryDetails.data.attributes.refillDate,
    );
    detailsPage.verifyRxShippedOnDateOnDetailsPage(
      refillHistoryDetails.data.attributes.dispensedDate,
    );
    // No image available added as a separate test
  });
});
