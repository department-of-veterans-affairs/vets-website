import mockFacilitiesSearchResultsV1 from '../../constants/mock-facility-data-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import mockServices from '../../constants/mock-provider-services.json';

describe('Form State Isolation - Draft State Pattern', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
    cy.intercept('GET', '/facilities_api/v2/ccp/specialties', mockServices).as(
      'mockServices',
    );
    cy.intercept(
      'POST',
      '/facilities_api/v2/va',
      mockFacilitiesSearchResultsV1,
    ).as('searchFacilitiesVA');
    cy.intercept(
      'GET',
      '/facilities_api/v2/va/vha_*',
      mockFacilitiesSearchResultsV1,
    );

    cy.visit('/find-locations');
    cy.injectAxe();
  });

  it('should not change result metadata when facility type dropdown changes', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    cy.get('.facility-result', { timeout: 10000 }).should('exist');
    cy.get('#search-results-subheader').should('contain', 'VA health');

    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA cemeteries');

    cy.get('#search-results-subheader').should('contain', 'VA health');
    cy.get('#search-results-subheader').should('not.contain', 'VA cemeteries');
    cy.get('.facility-result').should('exist');
    cy.axeCheck();
  });

  it('should not update results header during form editing', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('PrimaryCare');
    cy.get('#facility-search').click();

    cy.get('.facility-result', { timeout: 10000 }).should('exist');
    cy.get('#search-results-subheader').should('contain', 'Primary care');

    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('MentalHealth');

    cy.get('#search-results-subheader').should('contain', 'Primary care');
    cy.get('#search-results-subheader').should('not.contain', 'Mental health');
    cy.axeCheck();
  });

  it('should update results header only after form submit', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('PrimaryCare');
    cy.get('#facility-search').click();

    cy.get('.facility-result', { timeout: 10000 }).should('exist');
    cy.get('#search-results-subheader').should('contain', 'Primary care');

    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('MentalHealth');
    cy.get('#facility-search').click();

    cy.get('#search-results-subheader', { timeout: 10000 }).should(
      'contain',
      'Mental health',
    );
    cy.get('#search-results-subheader').should('not.contain', 'Primary care');
    cy.axeCheck();
  });

  it('should not change location text when editing without submit', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    cy.get('.facility-result', { timeout: 10000 }).should('exist');
    cy.get('#search-results-subheader').should('contain', 'Austin');

    cy.get('#street-city-state-zip')
      .clear()
      .type('Dallas TX');

    cy.get('#search-results-subheader').should('contain', 'Austin');
    cy.get('#search-results-subheader').should('not.contain', 'Dallas');
    cy.axeCheck();
  });

  it('should update location in results only after submit', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    cy.get('.facility-result', { timeout: 10000 }).should('exist');
    cy.get('#search-results-subheader').should('contain', 'Austin');

    // Change facility type (not location) and submit to verify results update
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA benefits');
    cy.get('#facility-search').click();

    cy.get('#search-results-subheader', { timeout: 10000 }).should(
      'contain',
      'VA benefits',
    );
    cy.axeCheck();
  });

  it('should not trigger duplicate search when submitting same values', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    cy.wait('@searchFacilitiesVA');

    cy.get('#facility-search').click();

    cy.get('@searchFacilitiesVA.all').should('have.length', 1);
    cy.axeCheck();
  });

  it('should allow new search after changing form values', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('#facility-search').click();

    cy.wait('@searchFacilitiesVA');

    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA benefits');
    cy.get('#facility-search').click();

    cy.wait('@searchFacilitiesVA');

    cy.get('@searchFacilitiesVA.all').should('have.length', 2);
    cy.axeCheck();
  });

  it('should maintain form values when editing without submit', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('PrimaryCare');

    cy.get('#street-city-state-zip').should('have.value', 'Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .should('have.value', 'health');
    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .should('have.value', 'PrimaryCare');

    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .select('MentalHealth');

    cy.get('.service-type-dropdown-tablet')
      .find('select')
      .should('have.value', 'MentalHealth');
    cy.axeCheck();
  });

  it('should not show validation errors during form editing', () => {
    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');

    cy.get('#street-city-state-zip').clear();

    // No validation error should show while editing (before submit)
    cy.get(
      '#street-city-state-zip-autosuggest-container.usa-input-error',
    ).should('not.exist');

    cy.get('#facility-search').click();

    cy.get('#street-city-state-zip-autosuggest-container.usa-input-error', {
      timeout: 4000,
    }).should('exist');
    cy.axeCheck();
  });

  it('should preserve query parameters in URL only after submit', () => {
    cy.url().should('not.include', 'facilityType');
    cy.url().should('not.include', 'serviceType');

    cy.get('#street-city-state-zip').type('Austin TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA health');

    cy.url().should('not.include', 'facilityType=health');

    cy.get('#facility-search').click();

    cy.url({ timeout: 10000 }).should('include', 'facilityType=health');
    cy.axeCheck();
  });
});
