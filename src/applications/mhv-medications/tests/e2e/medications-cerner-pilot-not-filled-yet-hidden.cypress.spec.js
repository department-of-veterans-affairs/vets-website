import MedicationsSite from './med_site/MedicationsSite';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockToggles from './fixtures/toggles-response.json';

describe('Medications Details Page - Cerner Pilot Enabled - Not Filled Yet Hidden', () => {
  const site = new MedicationsSite();
  const detailsPage = new MedicationsDetailsPage();
  const listPage = new MedicationsListPage();

  // Create mock toggles with Cerner pilot enabled
  const baseFeatures = mockToggles.data.features.filter(
    f => f.name !== 'mhv_medications_cerner_pilot',
  );
  const mockTogglesWithCernerPilot = {
    data: {
      type: 'feature_toggles',
      features: [
        ...baseFeatures,
        { name: 'mhv_medications_cerner_pilot', value: true },
      ],
    },
  };

  beforeEach(() => {
    site.login();
    cy.intercept('GET', '/v0/feature_toggles?*', mockTogglesWithCernerPilot).as(
      'featureToggles',
    );
  });

  it('does not display "Not filled yet" text when Cerner pilot is enabled', () => {
    listPage.visitMedicationsListPageURL(pendingPrescriptions);
    detailsPage.clickMedicationDetailsLink(pendingRxDetails, 1);
    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');

    // Verify "Last filled on" section is NOT displayed when Cerner pilot is enabled
    // and there is no dispense date
    detailsPage.verifyLastFilledDateNotDisplayedOnDetailsPage();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
