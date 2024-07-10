import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import mockFacilitiesSearchResultsv2 from '../../constants/mock-facility-data-v1.json';
import mockUrgentCareSearchResults from '../../constants/mock-urgent-care-mashup-data.json';
import mockEmergencyCareSearchResults from '../../constants/mock-emergency-care-mashup-data.json';
import mockServices from '../../constants/mock-provider-services.json';

const CC_PROVIDER = 'Community providers (in VA’s network)';
const NON_VA_URGENT_CARE = 'In-network community urgent care';

describe('Provider search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/v2/ccp/specialties', mockServices).as(
      'mockServices',
    );
    cy.intercept(
      'GET',
      '/facilities_api/v2/ccp/*specialties[]=1223X2210X*',
      mockFacilitiesSearchResultsv2,
    ).as('searchDentistsProvider');
    cy.intercept(
      'GET',
      '/facilities_api/v2/ccp/provider?*specialties[]=261QE0002X*',
      mockEmergencyCareSearchResults,
    ).as('searchFacilitiesProvider');
    cy.intercept(
      'GET',
      '/facilities_api/v2/ccp/urgent_care?*',
      mockUrgentCareSearchResults,
    ).as('searchUrgentCare');
    cy.intercept(
      'GET',
      '/facilities_api/v2/ccp/provider?*specialties[]=261QU0200X*',
      mockUrgentCareSearchResults,
    ).as('searchUrgentCare');
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('renders "Search for available service" prompt', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('Community providers (in VA’s network)');

    // Wait for services to be saved to state and input field to not be disabled
    cy.get('#service-type-ahead-input')
      .should('not.be.disabled')
      .focus();
    cy.get('#search-available-service-prompt').should('exist');

    cy.get('#service-type-ahead-input').type('D');
    cy.get('#search-available-service-prompt').should('exist');

    cy.get('#service-type-ahead-input').type('De');
    cy.get('#search-available-service-prompt').should('not.exist');
  });

  it("renders `We couldn't find that, please try another service ` prompt", () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('Community providers (in VA’s network)');

    cy.get('#service-type-ahead-input').type('djf');
    cy.get('#could-not-find-service-prompt').should('exist');
  });

  it('finds community dentists', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select(CC_PROVIDER);
    cy.get('#service-type-ahead-input').type('Dentist');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      `Results for "${CC_PROVIDER}", "Dentist - Orofacial Pain" near "Austin, Texas"`,
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result h3').contains('BADEA, LUANA');

    cy.get('.va-pagination').should('not.exist');
  });

  it('finds community urgent care - Clinic/Center', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select(CC_PROVIDER);
    cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      `Results for "${CC_PROVIDER}", "Clinic/Center - Urgent Care" near "Austin, Texas"`,
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result h3').contains('MinuteClinic');
    cy.get('.va-pagination').should('not.exist');
  });

  it('finds community urgent care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('Urgent care');
    cy.get('.service-type-dropdown-container')
      .find('select')
      .select(NON_VA_URGENT_CARE);
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      `Results for "Urgent care", "${NON_VA_URGENT_CARE}" near "Austin, Texas"`,
    );
    cy.get('#other-tools').should('exist');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('MinuteClinic');
    cy.get('.va-pagination').should('not.exist');
  });

  it('finds In-network community emergency care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('Emergency care');
    cy.get('.service-type-dropdown-container')
      .find('select')
      .select('In-network community emergency care');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "Emergency Care", "In-network community emergency care" near "Austin, Texas"',
    );
    cy.get('#emergency-care-info-note').should('exist');
    cy.get('.facility-result h3').contains('DELL SETON MEDICAL CENTER AT UT');

    cy.injectAxe();
    cy.axeCheck();
  });
});
