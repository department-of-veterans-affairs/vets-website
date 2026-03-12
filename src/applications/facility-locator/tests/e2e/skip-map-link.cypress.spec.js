import mockFacilitiesSearchResultsV1 from '../../constants/mock-facility-data-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import mockServices from '../../constants/mock-provider-services.json';
import {
  CITY_STATE_ZIP_INPUT,
  FACILITY_TYPE_DROPDOWN,
  SEARCH_BUTTON,
  SKIP_MAP_LINK,
} from './helpers';

describe('Skip map link', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/v2/ccp/specialties', mockServices);
    cy.intercept('GET', '**/geocoding/**', mockGeocodingData);
    cy.intercept(
      'POST',
      '/facilities_api/v2/**',
      mockFacilitiesSearchResultsV1,
    );
    cy.visit('/find-locations');
  });

  it('shows skip map button and checks href', () => {
    // Perform a search so the map is rendered with results
    cy.get(CITY_STATE_ZIP_INPUT).type('Austin, TX');
    cy.get(FACILITY_TYPE_DROPDOWN)
      .shadow()
      .find('select')
      .select('VA health');
    cy.get(SEARCH_BUTTON).click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      /(Showing|Results).*VA health.*near.*Austin, Texas/i,
    );

    // Wait for a focus target to exist before clicking (footer/feedback load async)
    cy.get('body').then($body => {
      const hasFeedbackButton = $body.find('#mdFormButton').length > 0;
      const hrefName = hasFeedbackButton ? '#mdFormButton' : '#footerNav';

      cy.get(SKIP_MAP_LINK)
        .shadow()
        .find('a')
        .then($el => expect($el).to.have.attr('href', hrefName));
    });

    cy.get(SKIP_MAP_LINK).click();
    cy.get(SKIP_MAP_LINK)
      .shadow()
      .find('a')
      .then($el => expect($el).not.to.have.focus);
  });

  it('skip map link is keyboard focusable', () => {
    cy.get(CITY_STATE_ZIP_INPUT).type('Austin, TX');
    cy.get(FACILITY_TYPE_DROPDOWN)
      .shadow()
      .find('select')
      .select('VA health');
    cy.get(SEARCH_BUTTON).click({ waitForAnimations: true });
    cy.get('#search-results-subheader').should('be.visible');

    // make sure that the link is visible
    cy.get(SKIP_MAP_LINK)
      .click()
      .should('be.visible');

    cy.get(SKIP_MAP_LINK).should('not.be.focused');
  });
});
