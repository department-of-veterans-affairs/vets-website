import MedicationsSite from './med_site/MedicationsSite';
import mockUser from './fixtures/user.json';
import cernerPilotToggles from './fixtures/toggles-cerner-pilot.json';
import prescriptions from './fixtures/prescriptions.json';
import { medicationsUrls, STATION_NUMBER_PARAM } from '../../util/constants';

describe('Medications Cerner Pilot station_number redirect', () => {
  const site = new MedicationsSite();
  const testPrescriptionId = '123456';

  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', cernerPilotToggles).as(
      'cernerPilotToggles',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=999',
      prescriptions,
    ).as('prescriptions');
    site.mockVamcEhr();
    cy.login(mockUser);
  });

  it('redirects to medications list when visiting details page without station_number and Cerner pilot enabled', () => {
    // Visit details page without station_number query param
    cy.visit(`${medicationsUrls.PRESCRIPTION_DETAILS}/${testPrescriptionId}`);

    // Should redirect to medications list
    cy.url().should('include', medicationsUrls.MEDICATIONS_URL);
    cy.url().should('not.include', medicationsUrls.subdirectories.DETAILS);
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('redirects to medications list when visiting documentation page without station_number and Cerner pilot enabled', () => {
    // Visit documentation page without station_number query param
    cy.visit(
      `${medicationsUrls.PRESCRIPTION_DETAILS}/${testPrescriptionId}${medicationsUrls.subdirectories.DOCUMENTATION}`,
    );

    // Should redirect to medications list
    cy.url().should('include', medicationsUrls.MEDICATIONS_URL);
    cy.url().should('not.include', medicationsUrls.subdirectories.DETAILS);
    cy.url().should(
      'not.include',
      medicationsUrls.subdirectories.DOCUMENTATION,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('does not redirect when station_number is present in URL', () => {
    const prescriptionId = '22545165';
    const stationNumber = '989';

    // Mock the v2 API call
    cy.intercept(
      'GET',
      `/my_health/v2/prescriptions/${prescriptionId}?${STATION_NUMBER_PARAM}=${stationNumber}`,
      {
        data: {
          id: prescriptionId,
          type: 'prescription_details',
          attributes: {
            prescriptionId: parseInt(prescriptionId, 10),
            prescriptionName: 'TEST MEDICATION',
            stationNumber,
            refillStatus: 'active',
            dispensedDate: '2024-01-15',
            orderedDate: '2024-01-01',
            quantity: 30,
            expirationDate: '2025-01-01',
            facilityName: 'Test VA Facility',
            prescriptionNumber: 'RX123456',
          },
        },
      },
    ).as('prescriptionById');

    // Visit details page WITH station_number query param
    cy.visit(
      `${medicationsUrls.PRESCRIPTION_DETAILS}/${prescriptionId}?${STATION_NUMBER_PARAM}=${stationNumber}`,
    );

    // Should stay on details page (not redirect)
    cy.url().should(
      'include',
      `${medicationsUrls.subdirectories.DETAILS}/${prescriptionId}`,
    );
    cy.url().should('include', `${STATION_NUMBER_PARAM}=${stationNumber}`);
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
