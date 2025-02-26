export const ROOT_URL = '/find-locations';
export const MAP_CONTAINER = '#mapbox-gl-container';
export const CITY_STATE_ZIP_INPUT = '#street-city-state-zip';
export const FACILITY_TYPE_DROPDOWN = '#facility-type-dropdown';
export const VA_HEALTH_SERVICE_DROPDOWN = '#service-type-dropdown';
export const CCP_SERVICE_TYPE_INPUT = '#service-type-ahead-input';
export const SEARCH_BUTTON = '#facility-search';

export const FACILITY_LISTING_CONTAINER = '.facility-result';
export const FACILITY_DISTANCE = '[data-testid="fl-results-distance"]';
export const FACILITY_ADDRESS = '[data-testid="facility-result-address"]';
export const DIRECTIONS_LINK = 'va-link[text="Get directions on Google Maps"]';
export const MAIN_PHONE = '[data-testid="Main phone"]';
export const VA_HEALTH_CONNECT_NUMBER = '[data-testid="VA health connect"]';
export const MENTAL_HEALTH_NUMBER = '[data-testid="Mental health"]';
export const TTY_NUMBER = 'va-telephone[contact="711"]';

export const SEARCH_RESULTS_SUMMARY = '#search-results-subheader';

export const MOBILE_MAP_PIN_SELECT_HELP_TEXT =
  'Select a number to show information about that location.';

export const MOBILE_MAP_NO_RESULTS_TEXT =
  'Try searching for something else or in a different area.';

export const MOBILE_LIST_SEARCH_TEXT =
  'Please enter a location (street, city, state, or postal code) and facility type, then click search above to find facilities.';

export const MOBILE_TAB_BUTTON = 'button[class*="segment"]';

export const MOBILE_MAP_RESULT_CONTAINER = '.mobile-search-result';

export const typeInCityStateInput = value =>
  cy.get(CITY_STATE_ZIP_INPUT).type(value);

export const typeAndSelectInCCPServiceTypeInput = value => {
  cy.get(CCP_SERVICE_TYPE_INPUT).type(value);
  cy.findByText(value)
    .eq(0)
    .click();
};

export const FACILITY_TYPES = {
  HEALTH: 'VA health',
  URGENT: 'Urgent care',
  EMERGENCY: 'Emergency care',
  CC_PRO: 'Community providers (in VA’s network)',
  CC_PHARM: 'Community pharmacies (in VA’s network)',
  VBA: 'VA benefits',
  CEM: 'VA cemeteries',
  VET: 'Vet Centers',
};

export const selectFacilityTypeInDropdown = value =>
  cy
    .get(FACILITY_TYPE_DROPDOWN)
    .shadow()
    .find('select')
    .select(value);

export const selectServiceTypeInVAHealthDropdown = value =>
  cy.get(VA_HEALTH_SERVICE_DROPDOWN).select(value);

export const submitSearchForm = () =>
  cy.get(SEARCH_BUTTON).click({ waitForAnimations: true });

export const verifyMainNumber = number => {
  cy.get(MAIN_PHONE)
    .should('exist')
    .and('contain.text', 'Main phone');

  cy.get(`${MAIN_PHONE} va-telephone`)
    .eq(0)
    .shadow()
    .find('a')
    .should('exist')
    .and('have.text', number);
};

export const verifyHealthConnectNumber = number => {
  cy.get(VA_HEALTH_CONNECT_NUMBER)
    .should('exist')
    .and('contain.text', 'VA health connect');

  cy.get(`${VA_HEALTH_CONNECT_NUMBER} va-telephone`)
    .eq(0)
    .shadow()
    .find('a')
    .should('exist')
    .and('have.text', number);
};

export const verifyMentalHealthNumber = number => {
  cy.get(MENTAL_HEALTH_NUMBER)
    .should('exist')
    .and('contain.text', 'Mental health');

  cy.get(`${MENTAL_HEALTH_NUMBER} va-telephone`)
    .eq(0)
    .shadow()
    .find('a')
    .should('exist')
    .and('have.text', number);
};

export const verifyTTYNumber = () =>
  cy
    .get(TTY_NUMBER)
    .should('exist')
    .and('be.visible');

export const verifyListingContents = details => {
  cy.get('.i-pin-card-map')
    .eq(details.index)
    .scrollIntoView()
    .should('have.text', details.pin);

  let facilityName = () =>
    cy
      .get('va-link')
      .eq(details.index)
      .shadow()
      .find('a');

  if (!details.website) {
    facilityName = () => cy.get('h3').eq(details.index);
  }

  facilityName().should('have.text', details.name);

  if (details.website) {
    facilityName().should('have.attr', 'href', details.website);
  }

  cy.get(FACILITY_DISTANCE)
    .eq(details.index)
    .should('have.text', details.distance);

  cy.get(FACILITY_ADDRESS)
    .eq(details.index)
    .should('have.text', `${details.addressLine1}${details.addressLine2}`);

  cy.get(DIRECTIONS_LINK)
    .should('exist')
    .and('be.visible')
    .should('have.attr', 'href', details.map);
};

export const verifyMobileListItem = (details, index) => {
  cy.get(FACILITY_LISTING_CONTAINER)
    .eq(index)
    .should('exist')
    .and('be.visible')
    .scrollIntoView()
    .within(() => verifyListingContents(details));
};

export const selectMobileMapTab = () =>
  cy
    .get(MOBILE_TAB_BUTTON)
    .eq(1)
    .click();

export const selectMobileMapPin = index =>
  cy
    .get(`.pin-${index}`)
    .scrollIntoView()
    .click();

export const verifyMobileMapItem = details => {
  cy.get(MOBILE_MAP_RESULT_CONTAINER)
    .eq(0)
    .should('exist')
    .should('be.visible')
    .within(() => verifyListingContents(details));
};

export const awaitMapRender = () =>
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);

export const verifyElementByText = text =>
  cy
    .findByText(text)
    .eq(0)
    .should('exist')
    .and('be.visible');

export const verifyElementShouldContainText = (selector, text) =>
  cy
    .get(selector)
    .should('exist')
    .and('be.visible')
    .and('contain.text', text);
