import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('verify navigation to medication details Page', () => {
  it('verify Medications details Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();

    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);

    detailsPage.verifyPrescriptionsNumber(
      mockPrescriptionDetails.data.attributes.prescriptionNumber,
    );
    detailsPage.verifyPrescriptionsStatus(
      mockPrescriptionDetails.data.attributes.refillStatus,
    );
    detailsPage.verifyPrescriptionsName(
      mockPrescriptionDetails.data.attributes.prescriptionName,
    );

    detailsPage.verifyPrescriptionsfacilityName(
      mockPrescriptionDetails.data.attributes.facilityName,
    );

    detailsPage.verifyPrescriptionsRefillsRemaining(
      mockPrescriptionDetails.data.attributes.refillRemaining,
    );
    detailsPage.verifyPrescriptionNameIsFocusedAfterLoading();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
