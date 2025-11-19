/**
 * Form State Isolation E2E Tests - Issue #20370
 *
 * These tests verify that form input changes do NOT update Redux state
 * or result metadata until the form is submitted.
 *
 * Key behavior being tested:
 * - Changing dropdowns should NOT update result headers
 * - Changing dropdowns should NOT update result metadata (health connect, burial links)
 * - Address autosuggest should NOT update Redux
 * - VAMC service autosuggest should NOT update Redux
 * - Only form SUBMIT should update Redux and results
 */

import mockFacilitiesSearchResultsV1 from '../../constants/mock-facility-data-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import mockServices from '../../constants/mock-provider-services.json';

describe('Form State Isolation - Draft State Pattern', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v1/facilities/va?*', mockFacilitiesSearchResultsV1);
    cy.intercept(
      'GET',
      '/v1/facilities/va/vha_*',
      mockFacilitiesSearchResultsV1,
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept(
      'GET',
      '/services/va_facilities/v1/ccp/provider_services',
      mockServices,
    );

    cy.visit('/find-locations');
    cy.injectAxe();
  });

  it('should not change result metadata when facility type dropdown changes', () => {
    // Perform initial search for VA health
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    // Wait for results
    cy.get('.facility-result', { timeout: 10000 }).should('exist');

    // Verify health-related metadata exists in results
    cy.get('#search-results-subheader').should('contain', 'VA health');

    // Change facility type dropdown WITHOUT submitting
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA cemeteries');

    // Result header should STILL say "VA health" (not update to cemetery)
    cy.get('#search-results-subheader').should('contain', 'VA health');
    cy.get('#search-results-subheader').should('not.contain', 'VA cemeteries');

    // Results should still be health results (not cemetery results)
    cy.get('.facility-result').should('exist');
  });

  it('should not update results header during form editing', () => {
    // Perform initial search for VA health
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('PrimaryCare');
    cy.get('#facility-search').click();

    // Wait for results
    cy.get('.facility-result', { timeout: 10000 }).should('exist');

    // Verify header shows Primary care
    cy.get('#search-results-subheader').should('contain', 'Primary care');

    // Change service type dropdown WITHOUT submitting
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('MentalHealth');

    // Header should STILL say "Primary care" (not update to Mental health)
    cy.get('#search-results-subheader').should('contain', 'Primary care');
    cy.get('#search-results-subheader').should('not.contain', 'Mental health');
  });

  it('should update results header only after form submit', () => {
    // Perform initial search for VA health
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('PrimaryCare');
    cy.get('#facility-search').click();

    // Wait for results
    cy.get('.facility-result', { timeout: 10000 }).should('exist');

    // Verify header shows Primary care
    cy.get('#search-results-subheader').should('contain', 'Primary care');

    // Change service type and SUBMIT
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('MentalHealth');
    cy.get('#facility-search').click();

    // Now header should update to Mental health
    cy.get('#search-results-subheader', { timeout: 10000 }).should(
      'contain',
      'Mental health',
    );
    cy.get('#search-results-subheader').should('not.contain', 'Primary care');
  });

  it('should not change location text when editing without submit', () => {
    // Perform initial search
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    // Wait for results
    cy.get('.facility-result', { timeout: 10000 }).should('exist');

    // Verify header contains "Austin TX"
    cy.get('#search-results-subheader').should('contain', 'Austin');

    // Clear and type new location WITHOUT submitting
    cy.get('#street-city-state-zip')
      .clear()
      .type('Dallas TX');

    // Header should STILL say "Austin" (not update to Dallas)
    cy.get('#search-results-subheader').should('contain', 'Austin');
    cy.get('#search-results-subheader').should('not.contain', 'Dallas');
  });

  it('should update location in results only after submit', () => {
    // Perform initial search
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    // Wait for results
    cy.get('.facility-result', { timeout: 10000 }).should('exist');

    // Verify header contains "Austin"
    cy.get('#search-results-subheader').should('contain', 'Austin');

    // Change location and SUBMIT
    cy.get('#street-city-state-zip')
      .clear()
      .type('Dallas TX');
    cy.get('#facility-search').click();

    // Now header should update to Dallas
    cy.get('#search-results-subheader', { timeout: 10000 }).should(
      'contain',
      'Dallas',
    );
  });

  it('should not trigger duplicate search when submitting same values', () => {
    // Spy on API calls
    cy.intercept('GET', '/v1/facilities/va?*', req => {
      req.alias = 'searchFacilities';
    }).as('searchFacilities');

    // Perform initial search
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    // Wait for first search to complete
    cy.wait('@searchFacilities');

    // Submit same form again (should be blocked by duplicate prevention)
    cy.get('#facility-search').click();

    // Verify only one API call was made (duplicate was blocked)
    cy.get('@searchFacilities.all').should('have.length', 1);
  });

  it('should allow new search after changing form values', () => {
    // Spy on API calls
    cy.intercept('GET', '/v1/facilities/va?*', req => {
      req.alias = 'searchFacilities';
    }).as('searchFacilities');

    // Perform initial search
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    // Wait for first search
    cy.wait('@searchFacilities');

    // Change facility type and submit
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA benefits');
    cy.get('#facility-search').click();

    // Should trigger a new search
    cy.wait('@searchFacilities');

    // Verify we have 2 API calls
    cy.get('@searchFacilities.all').should('have.length', 2);
  });

  it('should maintain form values when editing without submit', () => {
    // Enter form values
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('PrimaryCare');

    // Verify form has the values (draft state)
    cy.get('#street-city-state-zip').should('have.value', 'Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .should('have.value', 'health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .should('have.value', 'PrimaryCare');

    // Change values without submitting
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('MentalHealth');

    // Verify new draft value is shown in form
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .should('have.value', 'MentalHealth');
  });

  it('should not show validation errors during form editing', () => {
    // Enter valid values
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');

    // Clear location (invalid state) without submitting
    cy.get('#street-city-state-zip').clear();

    // Should not show validation error until submit
    cy.get('[error]').should('not.exist');

    // Try to submit (should show validation error now)
    cy.get('#facility-search').click();

    // Now validation error should appear
    cy.get('#street-city-state-zip[error]').should('exist');
  });

  it('should preserve query parameters in URL only after submit', () => {
    // Initial URL should not have query params
    cy.url().should('not.include', 'facilityType');
    cy.url().should('not.include', 'serviceType');

    // Enter form values but don't submit
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');

    // URL should still not have query params (draft not committed)
    cy.url().should('not.include', 'facilityType=health');

    // Submit form
    cy.get('#facility-search').click();

    // Now URL should have query params
    cy.url({ timeout: 10000 }).should('include', 'facilityType=health');
  });
});
