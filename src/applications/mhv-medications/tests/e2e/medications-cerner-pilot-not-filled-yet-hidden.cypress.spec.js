import MedicationsSite from './med_site/MedicationsSite';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import allergies from './fixtures/allergies.json';
import { medicationsUrls } from '../../util/constants';

describe('Medications Details Page - Accelerating Medications - Not Filled Yet Hidden', () => {
  const site = new MedicationsSite();
  const detailsPage = new MedicationsDetailsPage();
  const listPage = new MedicationsListPage();
  const updatedOrderDate = listPage.updatedOrderDates(pendingPrescriptions);

  beforeEach(() => {
    // Login with accelerated medications enabled (which includes the Cerner pilot toggle)
    site.login(true, false, true);
  });

  it('does not display "Not filled yet" text when accelerating medications', () => {
    // When accelerating medications, the app uses v2 endpoints
    cy.intercept(
      'GET',
      '/my_health/v2/prescriptions?page=1&per_page=10&sort=alphabetical-status',
      updatedOrderDate,
    ).as('v2Prescriptions');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergies');
    // Intercept v2 prescription details endpoint
    cy.intercept(
      'GET',
      `/my_health/v2/prescriptions/${
        pendingRxDetails.data.attributes.prescriptionId
      }`,
      pendingRxDetails,
    ).as('v2PrescriptionDetails');
    cy.visit(medicationsUrls.MEDICATIONS_URL);
    cy.wait('@v2Prescriptions');

    // Click on medication details link (card number 1)
    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) [data-testid="medications-history-details-link"]',
    ).should('be.visible');
    cy.get(
      '[data-testid="medication-list"] > :nth-child(1) [data-testid="medications-history-details-link"]',
    )
      .first()
      .click({ waitForAnimations: true });

    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');

    // Verify "Last filled on" section is NOT displayed when accelerating medications
    // and there is no dispense date
    detailsPage.verifyLastFilledDateNotDisplayedOnDetailsPage();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
