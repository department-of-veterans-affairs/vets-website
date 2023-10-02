import mockFacilitiesSearchResultsV1 from '../../constants/mock-facility-data-v1.json';
import mockFacilityDataV1 from '../../constants/mock-facility-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import mockLaLocation from '../../constants/mock-la-location.json';
import mockServices from '../../constants/mock-provider-services.json';

const CC_PROVIDER = 'Community providers (in VA’s network)';
const healthServices = {
  All: 'All VA health services',
  PrimaryCare: 'Primary care',
  MentalHealthCare: 'Mental health care',
  Covid19Vaccine: 'COVID-19 vaccine',
  DentalServices: 'Dental services',
  UrgentCare: 'Urgent care',
  EmergencyCare: 'Emergency care',
  Audiology: 'Audiology',
  Cardiology: 'Cardiology',
  Dermatology: 'Dermatology',
  Gastroenterology: 'Gastroenterology',
  Gynecology: 'Gynecology',
  Ophthalmology: 'Ophthalmology',
  Optometry: 'Optometry',
  Orthopedics: 'Orthopedics',
  Urology: 'Urology',
  WomensHealth: "Women's health",
  Podiatry: 'Podiatry',
  Nutrition: 'Nutrition',
  CaregiverSupport: 'Caregiver support',
};

Cypress.Commands.add('verifyOptions', () => {
  // Va facilities have services available
  cy.get('#facility-type-dropdown').select('VA health');
  cy.get('#service-type-dropdown').should('not.have.attr', 'disabled');
  const hServices = Object.keys(healthServices);

  for (let i = 0; i < hServices.length; i++) {
    cy.get('#service-type-dropdown')
      .children()
      .eq(i)
      .then($option => {
        const value = $option.attr('value');
        expect(value).to.equal(hServices[i]);
      });
  }

  cy.get('#facility-type-dropdown').select('Urgent care');
  cy.get('#service-type-dropdown').should('not.have.attr', 'disabled');
  cy.get('#facility-type-dropdown').select('VA benefits');
  cy.get('#service-type-dropdown').should('not.have.attr', 'disabled');

  // Va facilities don't have services available
  cy.get('#facility-type-dropdown').select('Vet Centers');
  cy.get('#service-type-dropdown').should('not.have', 'disabled');
  cy.get('#facility-type-dropdown').select('VA cemeteries');
  cy.get('#service-type-dropdown').should('not.have', 'disabled');

  // CCP care have services available
  cy.get('#facility-type-dropdown').select(
    'Community providers (in VA’s network)',
  );
  cy.get('#service-typeahead').should('not.have.attr', 'disabled');

  // CCP pharmacies dont have services available
  cy.get('#facility-type-dropdown').select(
    'Community pharmacies (in VA’s network)',
  );
  cy.get('#service-typeahead').should('not.have', 'disabled');
});

describe('Facility VA search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/v1/ccp/specialties', mockServices).as(
      'mockServices',
    );
    cy.intercept(
      'GET',
      '/facilities_api/v1/ccp/provider?**',
      mockFacilitiesSearchResultsV1,
    ).as('searchFacilitiesCCP');
    cy.intercept(
      'GET',
      '/facilities_api/v1/va?type=**',
      mockFacilitiesSearchResultsV1,
    ).as('searchFacilitiesVA');
    cy.intercept('GET', '/facilities_api/v1/va/vba**', mockFacilityDataV1).as(
      'facilityDetail',
    );
  });

  it('does a simple search and finds a result on the list', () => {
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);

    cy.visit('/find-locations');

    cy.injectAxe();
    cy.axeCheck();

    cy.verifyOptions();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#service-type-dropdown').select('Primary care');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "VA health", "Primary care" near "Austin, Texas"',
    );
    cy.get('.facility-result a').should('exist');
    cy.get('.i-pin-card-map').contains('A');
    cy.get('.i-pin-card-map').contains('B');
    cy.get('.i-pin-card-map').contains('C');
    cy.get('.i-pin-card-map').contains('D');

    cy.get('#other-tools').should('exist');
  });

  it.skip('should render breadcrumbs ', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#facility-search')
      .click({ waitForAnimations: true })
      .then(() => {
        cy.injectAxe();
        cy.axeCheck();

        cy.get('.facility-result a').should('exist');
        cy.intercept(
          'GET',
          '/v1/facilities/va/vha_674BY',
          mockFacilitiesSearchResultsV1,
        ).as('fetchFacility');

        cy.findByText(/austin va clinic/i, { selector: 'a' })
          .first()
          .click({ waitForAnimations: true })
          .then(() => {
            cy.axeCheck();

            cy.get('.all-details', { timeout: 10000 }).should('exist');

            cy.get('a[aria-current="page"').should('exist');

            cy.get(
              '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
            ).should('exist');

            cy.get(
              '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
            ).contains('Facility Details');

            cy.get('.va-nav-breadcrumbs-list li:nth-of-type(2) a').click({
              waitForAnimations: true,
            });

            // Mobile View
            cy.viewport(375, 667);

            cy.get('.va-nav-breadcrumbs-list').should('exist');

            cy.get('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))')
              .should('have.css', 'display')
              .and('match', /none/);

            cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').contains(
              'Home',
            );
          });
      });
  });

  it('shows search result header even when no results are found', () => {
    cy.visit('/find-locations');
    cy.intercept('GET', '/facilities_api/v1/ccp/provider?**', {
      data: [],
      meta: { pagination: { totalEntries: 0 } },
    }).as('searchFacilities');

    cy.get('#street-city-state-zip').type('27606');
    cy.get('#facility-type-dropdown').select(CC_PROVIDER);
    cy.get('#service-type-ahead-input').type('General');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);

    cy.focused().contains(
      'No results found for "Community providers (in VA’s network)", "General Acute Care Hospital" near "Raleigh, North Carolina 27606"',
    );
    cy.get('#other-tools').should('exist');
  });

  it('finds va benefits facility and views its page', () => {
    cy.intercept('GET', '/geocoding/**/*', mockLaLocation).as('caLocation');

    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Los Angeles');
    cy.get('#facility-type-dropdown').select('VA benefits');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "VA benefits", "All VA benefit services" near "Los Angeles, California"',
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result a').contains(
      'VetSuccess on Campus at Los Angeles City College',
    );
    cy.findByText(/VetSuccess on Campus at Los Angeles City College/i, {
      selector: 'a',
    })
      .first()
      .click({ waitForAnimations: true });
    // Note - we're using mock data so the names don't match.
    cy.get('h1').contains('Austin VA Clinic');
    cy.get('.p1')
      .first()
      .should('exist');
    cy.get('.facility-phone-group').should('exist');
    cy.findByText(/Get Directions/i).should('exist');
    cy.get('[alt="Static map"]').should('exist');
    cy.get('#hours-op h3').contains('Hours of operation');
    cy.get('#other-tools').should('not.exist');

    cy.axeCheck();
  });

  it('should not trigger Use My Location when pressing enter in the input field', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('27606{enter}');
    // Wait for Use My Location to be triggered (it should not be)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(8000);
    // If Use My Location is triggered and succeeds, it will change the contents of the search field:
    cy.get('#street-city-state-zip')
      .invoke('val')
      .then(searchString => expect(searchString).to.equal('27606'));
    // If Use My Location is triggered and fails, it will trigger a modal alert:
    cy.get('#va-modal-title').should('not.exist');
  });

  it('finds VA emergency care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Alexandria Virginia');
    cy.get('#facility-type-dropdown').select('Emergency care');
    cy.get('#service-type-dropdown').select('VA emergency care');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "Emergency Care", "VA emergency care" near "Alexandria, Virginia"',
    );
    cy.get('.search-result-emergency-care-subheader').should('exist');
    cy.get('.facility-result h3 a').contains('Alexandria Vet Center');

    cy.injectAxe();
    cy.axeCheck();
  });
});
