import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import mockLaLocation from '../../constants/mock-la-location.json';
import CcpHelpers from './helpers/ccp-helpers-cypress';
import FacilityHelpers from './helpers/facility-helpers-cypress';
import {
  selectFacilityTypeInDropdown,
  selectServiceTypeInVAHealthDropdown,
  FACILITY_TYPES,
  typeInCityStateInput,
  typeAndSelectInCCPServiceTypeInput,
  submitSearchForm,
} from './helpers';

const healthServices = {
  All: 'All VA health services',
  PrimaryCare: 'Primary care',
  MentalHealth: 'Mental health care',
  Dental: 'Dental services',
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
  selectFacilityTypeInDropdown(FACILITY_TYPES.HEALTH);
  cy.get('.service-type-dropdown-desktop')
    .find('select')
    .should('not.have.attr', 'disabled');
  const hServices = Object.keys(healthServices);

  for (let i = 0; i < hServices.length; i++) {
    cy.get('.service-type-dropdown-desktop')
      .find('select')
      .children()
      .eq(i)
      .then($option => {
        const value = $option.attr('value');
        expect(value).to.equal(hServices[i]);
      });
  }

  selectFacilityTypeInDropdown(FACILITY_TYPES.URGENT);
  cy.get('.service-type-dropdown-desktop')
    .find('select')
    .should('not.have.attr', 'disabled');

  // Va facilities don't have services available
  selectFacilityTypeInDropdown(FACILITY_TYPES.VET);
  cy.get('.service-type-dropdown-desktop').should('not.exist');

  selectFacilityTypeInDropdown(FACILITY_TYPES.CEM);

  selectFacilityTypeInDropdown(FACILITY_TYPES.VBA);

  // CCP care have services available
  selectFacilityTypeInDropdown(FACILITY_TYPES.CC_PRO);
  cy.get('#service-type-loading').should('exist');
  cy.get('#service-typeahead').should('not.have.attr', 'disabled');

  // CCP pharmacies dont have services available
  selectFacilityTypeInDropdown(FACILITY_TYPES.CC_PHARM);
  cy.get('#service-typeahead').should('not.exist');
});

describe('Facility VA search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        features: [
          { name: 'facilities_use_fl_progressive_disclosure', value: true },
        ],
      },
    });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    CcpHelpers.initApplicationMock();
    FacilityHelpers.initApplicationMock();
  });

  it('does a simple search and finds a result on the list', () => {
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);

    cy.visit('/find-locations');

    cy.injectAxe();
    cy.axeCheck();

    // cy.verifyOptions();

    typeInCityStateInput('Austin, TX');
    selectFacilityTypeInDropdown(FACILITY_TYPES.HEALTH);
    cy.get('#service-type-dropdown').select('Primary care');
    cy.get('#facility-search').click();

    cy.get('#search-results-subheader').contains(
      /(Showing|Results).*VA health.*Primary care.*within.*miles of.*Austin, Texas/i,
    );
    cy.get('.facility-result a').should('exist');
    cy.get('.i-pin-card-map').contains('1');
    cy.get('.i-pin-card-map').contains('2');
    cy.get('.i-pin-card-map').contains('3');

    cy.get('#other-tools').should('exist');
  });

  it('shows search result header even when no results are found', () => {
    cy.visit('/find-locations');
    cy.injectAxe();
    cy.axeCheck();
    // override so no provider data
    CcpHelpers.initApplicationMock('', 'mockProviders');
    typeInCityStateInput('27606');
    selectFacilityTypeInDropdown(FACILITY_TYPES.CC_PRO);
    cy.get('#service-typeahead').should('not.have.attr', 'disabled');

    typeAndSelectInCCPServiceTypeInput('General Acute Care Hospital');

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').should('exist');
    cy.focused().contains(
      'No results found for "Community providers (in VA’s network)", "General Acute Care Hospital" within 68 miles of "Raleigh, North Carolina 27606"',
    );
    cy.get('#other-tools').should('exist');
  });

  it('finds va benefits facility and views its page', () => {
    cy.intercept('GET', '/geocoding/**/*', mockLaLocation).as('caLocation');

    cy.visit('/find-locations');
    cy.injectAxe();
    typeInCityStateInput('Los Angeles, CA');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('VA benefits');
    submitSearchForm();
    cy.get('#search-results-subheader').contains(
      /(Showing|Results).*VA benefits.*All VA benefit services.*Los Angeles.*California/i,
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
      .click({
        waitForAnimations: true,
      });

    // Note - we're using mock data so the names don't match.
    cy.get('h1').contains('VetSuccess on Campus at Los Angeles City College');
    cy.get('.p1')
      .first()
      .should('exist');
    cy.get('.facility-phone-group').should('exist');
    cy.get('va-link')
      .eq(0)
      .shadow()
      .get('a')
      .contains(/Get directions/i);
    cy.get('[alt="Static map"]').should('exist');
    cy.get('#hours-op h3').contains('Hours of operation');
    cy.get('#other-tools').should('not.exist');

    cy.axeCheck();
  });

  it('should not trigger Use My Location when pressing enter in the input field', () => {
    cy.visit('/find-locations');
    cy.injectAxe();
    cy.axeCheck();
    typeInCityStateInput('27606');
    // Poll to ensure Use My Location is not triggered (checks every 500ms for 8 seconds)
    // If Use My Location is triggered and succeeds, it will change the contents of the search field:
    cy.get('#street-city-state-zip', { timeout: 8000 }).should(
      'have.value',
      '27606',
    );
    // If Use My Location is triggered and fails, it will trigger a modal alert:
    cy.get('#va-modal-title').should('not.exist');
  });

  it('finds VA emergency care', () => {
    cy.visit('/find-locations');
    typeInCityStateInput('Austin, TX');
    selectFacilityTypeInDropdown(FACILITY_TYPES.EMERGENCY);
    selectServiceTypeInVAHealthDropdown('VA emergency care');
    submitSearchForm();
    cy.get('#search-results-subheader').contains(
      'Results for "Emergency Care", "VA emergency care" within 139 miles of "Austin, Texas"',
    );
    cy.get('#emergency-care-info-note').should('exist');
    cy.get('.facility-result h3 va-link')
      .shadow()
      .get('a')
      .contains('Los Angeles'); // just because of the results we supply

    cy.injectAxe();
    cy.axeCheck();
  });
});
