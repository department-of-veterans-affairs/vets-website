import mockFacilityDataV1 from '../../constants/mock-facility-data-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import {
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} from './featureTogglesToTest';

const city = 'Austin, TX';
const randomInput = 'Random Input To be Cleared';

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
  'facilities_use_address_typeahead',
  'facility_locator_mobile_map_update',
]);

Cypress.Commands.add('checkClearInput', clearInputSelector => {
  cy.get('#street-city-state-zip').clear();
  cy.axeCheck();
  [...randomInput].forEach(char => {
    cy.get('#street-city-state-zip')
      .should('not.be.disabled')
      .focus()
      .type(char, { force: true });
  });
  cy.get(clearInputSelector).click();
  cy.get('#street-city-state-zip').should('have.value', '');
});

Cypress.Commands.add('checkSearch', isMobileMapUpdateEnabled => {
  cy.axeCheck();

  // Search
  cy.get('#street-city-state-zip', { timeout: 10000 })
    .should('exist')
    .should('not.be.disabled')
    .clear({ force: true });

  cy.get('#street-city-state-zip')
    .should('not.be.disabled')
    .focus()
    .type(`${city}{esc}`, { force: true });
  cy.get('#facility-type-dropdown')
    .shadow()
    .find('select')
    .select('VA health');
  cy.get('#facility-search').click();

  // Search title
  cy.get('#search-results-subheader', { timeout: 10000 }).should('exist');

  // Tabs
  if (!isMobileMapUpdateEnabled) {
    cy.get('#react-tabs-0').contains('View List');
    cy.get('#react-tabs-2').contains('View Map');
  } else {
    cy.get("button.segment[role='tab']")
      .eq(0)
      .contains('View List');
    cy.get("button.segment[role='tab']")
      .eq(1)
      .contains('View Map');
  }
  // Result list
  cy.get('.facility-result').should('exist');

  // Switch tab map
  if (!isMobileMapUpdateEnabled) {
    cy.get('#react-tabs-2')
      .should('not.be.disabled')
      .click({ waitForAnimations: true });
  } else {
    cy.get("button.segment[role='tab']")
      .eq(1)
      .should('not.be.disabled')
      .click({ waitForAnimations: true });
  }

  // Ensure map is visible
  cy.get('#mapbox-gl-container').should('be.visible');

  // Pin
  cy.get('.i-pin-card-map')
    .should('be.visible')
    .contains('1');

  // Back to Result list
  if (!isMobileMapUpdateEnabled) {
    cy.get('#react-tabs-0').click();
  } else {
    cy.get("button.segment[role='tab']")
      .eq(0)
      .click();
  }
  cy.get('#street-city-state-zip').clear();
});

for (const featureSet of featureSetsToTest) {
  describe(`Mobile ${enabledFeatures(featureSet)}`, () => {
    const clearInputSelector = featureSet.some(
      isFeatureEnabled('facilities_use_address_typeahead'),
    )
      ? '#clear-street-city-state-zip'
      : '#clear-input';

    const isMobileMapUpdateEnabled = featureSet.some(
      isFeatureEnabled('facility_locator_mobile_map_update'),
    );

    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: featureSet,
        },
      });
      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('POST', '/facilities_api/**', mockFacilityDataV1).as(
        'searchFacilities',
      );
      cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
    });

    it(`should render in mobile layouts, clear input checks and ${
      isMobileMapUpdateEnabled ? 'control group' : 'tabs'
    } actions work`, () => {
      cy.visit('/find-locations');
      cy.injectAxe();

      // iPhone X
      cy.viewport(400, 812);
      cy.checkClearInput(clearInputSelector);
      cy.checkSearch(isMobileMapUpdateEnabled);

      // iPhone 6/7/8 plus
      cy.viewport(414, 736);
      cy.checkClearInput(clearInputSelector);
      cy.checkSearch(isMobileMapUpdateEnabled);

      // Pixel 2
      cy.viewport(411, 731);
      cy.checkClearInput(clearInputSelector);
      cy.checkSearch(isMobileMapUpdateEnabled);

      // Galaxy S5/Moto
      cy.viewport(360, 640);
      cy.checkClearInput(clearInputSelector);
      cy.checkSearch(isMobileMapUpdateEnabled);
    });

    // [W,H, width of #facility-search, +/- range (this matters for CI) where it gets confused how to apply style sheets]
    const sizes = featureSet.some(
      isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
    )
      ? [
          [1024, 1000, 299, 20],
          [1007, 1000, 900, 100],
          [768, 1000, 699, 40],
          [481, 1000, 436, 40],
        ]
      : [
          [1024, 1000, 180.25, 140],
          [1007, 1000, 900, 100],
          [768, 1000, 699, 40],
          [481, 1000, 436, 40],
        ];
    const smDesktopOrGreater = 1024;
    const tabletOrGreater = 768;
    const phoneOrGreater = 320;

    sizes.forEach(size => {
      it(`should render in desktop layout at ${size[0]}x${size[1]}`, () => {
        cy.viewport(size[0], size[1]);
        cy.visit('/find-locations');
        cy.injectAxe();
        cy.axeCheck();
        cy.get('#facility-search').then($element => {
          // increased this range because locally it was 699 and on the CI it was 684 for tablet
          // similarly for 481px it was 436 locally and 421 on CI
          expect($element.width()).closeTo(size[2], size[3]);
        });

        if (
          size[0] >= smDesktopOrGreater &&
          featureSet.some(
            isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
          )
        ) {
          cy.get('#vertical-oriented-left-controls').should('exist');
          cy.get('.react-tabs').should('not.exist');
        } else if (size[0] >= tabletOrGreater) {
          cy.get('#vertical-oriented-left-controls').should('not.exist');
          cy.get('.tablet-results-map-container').should('exist');
          cy.get('.react-tabs').should('not.exist');
        } else if (size[0] > phoneOrGreater) {
          cy.get('#vertical-oriented-left-controls').should('not.exist');
          cy.get('.tablet-results-map-container').should('not.exist');
          if (!isMobileMapUpdateEnabled) {
            cy.get('.react-tabs').should('exist');
          } else {
            cy.get('.react-tabs').should('not.exist');
            cy.get('.segmented-control-container').should('exist');
          }
        }
      });
    });
  });
}
