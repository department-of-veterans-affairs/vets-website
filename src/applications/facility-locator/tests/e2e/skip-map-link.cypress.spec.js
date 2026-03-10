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

  it('shows skip map button and moves focus to footer when clicked', () => {
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
    cy.get('body').should($body => {
      const hasFooterFocusable =
        $body.find('#footerNav').find('a[href], button').length > 0;
      const hasFeedbackButton =
        $body.find('#mdFormButton .usa-button').length > 0;
      expect(
        hasFooterFocusable || hasFeedbackButton,
        'either first focusable in footer or feedback button must be present in the DOM',
      ).to.be.true;
    });

    cy.get(SKIP_MAP_LINK)
      .focus()
      .should('have.focus')
      .click();

    cy.get('body').then($body => {
      const hasFeedbackButton =
        $body.find('#mdFormButton .usa-button').length > 0;

      if (hasFeedbackButton) {
        cy.get('#mdFormButton .usa-button').should('have.focus');
      } else {
        cy.get('#footerNav')
          .find('a[href], button')
          .first()
          .should('have.focus');
      }
    });
  });

  it('skip map link is keyboard focusable', () => {
    cy.get(CITY_STATE_ZIP_INPUT).type('Austin, TX');
    cy.get(FACILITY_TYPE_DROPDOWN)
      .shadow()
      .find('select')
      .select('VA health');
    cy.get(SEARCH_BUTTON).click({ waitForAnimations: true });
    cy.get('#search-results-subheader').should('be.visible');

    // make sure that the link is visible and has focus
    // resolved issues with loading/timing in production
    cy.get(SKIP_MAP_LINK)
      .focus()
      .should('be.visible');

    cy.get(SKIP_MAP_LINK)
      .focus()
      .should('have.focus');
  });
});
