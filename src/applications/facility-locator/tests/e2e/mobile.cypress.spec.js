import mockFacilityDataV1 from '../../constants/mock-facility-data-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

const city = 'Austin, TX';
const randomInput = 'Random Input To be Cleared';

Cypress.Commands.add('checkClearInput', () => {
  cy.get('#street-city-state-zip').clear();
  cy.axeCheck();
  [...randomInput].forEach(char => {
    cy.get('#street-city-state-zip')
      .should('not.be.disabled')
      .focus()
      .type(char, { force: true });
  });
  cy.get('#clear-input').click();
  cy.get('#street-city-state-zip').should('have.value', '');
});

Cypress.Commands.add('checkSearch', () => {
  cy.axeCheck();

  // Search
  cy.get('#street-city-state-zip', { timeout: 10000 })
    .should('exist')
    .should('not.be.disabled')
    .clear({ force: true });

  cy.get('#street-city-state-zip')
    .should('not.be.disabled')
    .focus()
    .type(city, { force: true });
  cy.get('#facility-type-dropdown')
    .shadow()
    .find('select')
    .select('VA health');
  cy.get('#facility-search').click();

  // Search title
  cy.get('#search-results-subheader', { timeout: 10000 }).should('exist');

  // Tabs
  cy.get('#react-tabs-0').contains('View List');
  cy.get('#react-tabs-2').contains('View Map');

  // Result list
  cy.get('.facility-result').should('exist');

  // Switch tab map
  cy.get('#react-tabs-2')
    .should('not.be.disabled')
    .click({ waitForAnimations: true });

  // Ensure map is visible
  cy.get('#mapbox-gl-container').should('be.visible');

  // Pin
  cy.get('.i-pin-card-map')
    .should('be.visible')
    .contains('1');

  // Back to Result list
  cy.get('#react-tabs-0').click();
  cy.get('#street-city-state-zip').clear();
});

describe('Mobile', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('POST', '/facilities_api/**', mockFacilityDataV1).as(
      'searchFacilities',
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('should render in mobile layouts, clear input checks and tabs actions work', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    // iPhone X
    cy.viewport(400, 812);
    cy.checkClearInput();
    cy.checkSearch();

    // iPhone 6/7/8 plus
    cy.viewport(414, 736);
    cy.checkClearInput();
    cy.checkSearch();

    // Pixel 2
    cy.viewport(411, 731);
    cy.checkClearInput();
    cy.checkSearch();

    // Galaxy S5/Moto
    cy.viewport(360, 640);
    cy.checkClearInput();
    cy.checkSearch();
  });

  // [W,H, width of #facility-search]
  const sizes = [
    [1024, 1000, 280],
    [1007, 1000, 100],
    [768, 1000, 699],
    [481, 1000, 436],
  ];
  const desktopExistsGreaterThanEq = 768;
  const reactTabsExistsLessThanEq = 481;

  sizes.forEach(size => {
    it(`should render in desktop layout at ${size[0]}x${size[1]}`, () => {
      cy.viewport(size[0], size[1]);
      cy.visit('/find-locations');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('#facility-search').then($element => {
        // increased this range because locally it was 699 and on the CI it was 684 for tablet
        // similarly for 481px it was 436 locally and 421 on CI
        expect($element.width()).closeTo(size[2], 20);
      });

      if (size[0] >= desktopExistsGreaterThanEq) {
        cy.get('.desktop-map-container').should('exist');
        cy.get('.react-tabs').should('not.exist');
      } else if (size[0] <= reactTabsExistsLessThanEq) {
        cy.get('.desktop-map-container').should('not.exist');
        cy.get('.react-tabs').should('exist');
      }
    });
  });
});
