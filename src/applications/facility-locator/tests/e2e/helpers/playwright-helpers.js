/**
 * Playwright helpers for facility-locator E2E tests.
 * Ports the Cypress helpers from ./index.js to Playwright equivalents.
 */
const { expect } = require('@playwright/test');

// Selectors (same as Cypress helpers)
const ROOT_URL = '/find-locations';
const MAP_CONTAINER = '#mapbox-gl-container';
const CITY_STATE_ZIP_INPUT = '#street-city-state-zip';
const FACILITY_TYPE_DROPDOWN = '#facility-type-dropdown';
const VA_HEALTH_SERVICE_DROPDOWN = '#service-type-dropdown';
const CCP_SERVICE_TYPE_INPUT = '#service-type-ahead-input';
const SEARCH_BUTTON = '#facility-search';
const SEARCH_AVAILABLE = '#search-available-service-prompt';
const NO_SERVICE = '#could-not-find-service-prompt';
const AUTOSUGGEST_ADDRESS_INPUT =
  '[data-testid="street-city-state-zip-input-with-clear"]';
const AUTOSUGGEST_ADDRESS_CONTAINER =
  '#street-city-state-zip-autosuggest-container';
const AUTOSUGGEST_ADDRESS_OPTIONS = '[data-testid="autosuggest-options"]';
const AUTOSUGGEST_INPUT = '[data-testid="vamc-services-input-with-clear"]';
const AUTOSUGGEST_ARROW =
  '[data-e2e-id="vamc-services-autosuggest-arrow-button"]';
const AUTOSUGGEST_CLEAR = '#clear-vamc-services';
const OPTIONS = 'p[role="option"]';

const FACILITY_LISTING_CONTAINER = '.facility-result';
const FACILITY_DISTANCE = '[data-testid="fl-results-distance"]';
const FACILITY_ADDRESS = '[data-testid="facility-result-address"]';
const DIRECTIONS_LINK = 'va-link[text="Get directions on Google Maps"]';
const MAIN_PHONE = '[data-testid="Main phone"]';
const VA_HEALTH_CONNECT_NUMBER = '[data-testid="VA health connect"]';
const MENTAL_HEALTH_NUMBER = '[data-testid="Mental health"]';
const TTY_NUMBER = 'va-telephone[contact="711"]';

const SEARCH_RESULTS_SUMMARY = '#search-results-subheader';

const MOBILE_MAP_PIN_SELECT_HELP_TEXT =
  'Select a number to show information about that location.';
const MOBILE_MAP_NO_RESULTS_TEXT =
  'Try searching for something else. Or try searching in a different area.';
const MOBILE_LIST_SEARCH_TEXT =
  'Enter a location (street, city, state, or zip code) and facility type, then search to find facilities.';
const MOBILE_TAB_BUTTON = 'button[class*="segment"]';
const MOBILE_MAP_RESULT_CONTAINER = '.mobile-search-result';

const SEARCH_FORM_ERROR_MESSAGE = '.usa-input-error-message';
const SEARCH_FORM_ERROR_MESSAGE_2 = '.usa-error-message';

const FACILITY_TYPES = {
  HEALTH: 'VA health',
  URGENT: 'Urgent care',
  EMERGENCY: 'Emergency care',
  CC_PRO: 'Community providers (in VA\u2019s network)',
  CC_PHARM: 'Community pharmacies (in VA\u2019s network)',
  VBA: 'VA benefits',
  CEM: 'VA cemeteries',
  VET: 'Vet Centers',
};

// --- Helper functions ---

async function typeInCityStateInput(page, value, shouldCloseDropdown = false) {
  await page.locator(CITY_STATE_ZIP_INPUT).fill(value);
  if (shouldCloseDropdown) {
    await page.locator(CITY_STATE_ZIP_INPUT).press('Escape');
  }
}

async function typeInAutosuggestInput(page, value) {
  await page.locator(AUTOSUGGEST_INPUT).fill(value);
}

async function typeAndSelectInCCPServiceTypeInput(page, value) {
  await page.locator(CCP_SERVICE_TYPE_INPUT).fill(value);
  await page
    .getByText(value, { exact: true })
    .first()
    .click();
}

async function typeInCCPServiceTypeInput(page, value) {
  await page.locator(CCP_SERVICE_TYPE_INPUT).fill(value);
}

async function clearInput(page, selector) {
  await page.locator(selector).clear();
  await expect(page.locator(selector)).toHaveValue('');
}

async function vaSelectSelect(page, value, dropdownSelector) {
  await page
    .locator(dropdownSelector)
    .locator('select')
    .selectOption(value, { force: true });
}

async function selectFacilityTypeInDropdown(page, value) {
  await vaSelectSelect(page, value, FACILITY_TYPE_DROPDOWN);
}

async function selectServiceTypeInVAHealthDropdown(page, value) {
  await page.locator(VA_HEALTH_SERVICE_DROPDOWN).selectOption(value);
}

async function submitSearchForm(page) {
  await page.locator(SEARCH_BUTTON).click();
}

async function clickElement(page, selector) {
  await page
    .locator(selector)
    .first()
    .click();
}

async function verifyMainNumber(page, number) {
  const mainPhone = page.locator(MAIN_PHONE).first();
  await expect(mainPhone).toBeVisible();
  await expect(mainPhone).toContainText('Main phone');
  const tel = mainPhone
    .locator('va-telephone')
    .first()
    .locator('a');
  await expect(tel).toHaveText(number);
}

async function verifyHealthConnectNumber(page, number) {
  const el = page.locator(VA_HEALTH_CONNECT_NUMBER).first();
  await expect(el).toBeVisible();
  await expect(el).toContainText('VA health connect');
  const tel = el
    .locator('va-telephone')
    .first()
    .locator('a');
  await expect(tel).toHaveText(number);
}

async function verifyMentalHealthNumber(page, number) {
  const el = page.locator(MENTAL_HEALTH_NUMBER).first();
  await expect(el).toBeVisible();
  await expect(el).toContainText('Mental health');
  const tel = el
    .locator('va-telephone')
    .first()
    .locator('a');
  await expect(tel).toHaveText(number);
}

async function verifyTTYNumber(page) {
  await expect(page.locator(TTY_NUMBER).first()).toBeVisible();
}

async function verifyListingContents(page, container, details) {
  const pin = container.locator('.i-pin-card-map');
  await expect(pin).toHaveText(String(details.pin));

  if (details.website) {
    const link = container
      .locator('va-link')
      .nth(details.index)
      .locator('a');
    await expect(link).toHaveText(details.name);
    await expect(link).toHaveAttribute('href', details.website);
  } else {
    const heading = container.locator('h3').nth(details.index);
    await expect(heading).toHaveText(details.name);
  }

  const distance = container.locator(FACILITY_DISTANCE);
  await expect(distance).toHaveText(details.distance);

  const address = container.locator(FACILITY_ADDRESS);
  await expect(address).toHaveText(
    `${details.addressLine1}${details.addressLine2}`,
  );

  await expect(container.locator(DIRECTIONS_LINK)).toBeVisible();
}

async function verifyMobileListItem(page, details, index) {
  const container = page.locator(FACILITY_LISTING_CONTAINER).nth(index);
  await container.scrollIntoViewIfNeeded();
  await expect(container).toBeVisible();
  await verifyListingContents(page, container, details);
}

async function selectMobileMapTab(page) {
  await page
    .locator(MOBILE_TAB_BUTTON)
    .nth(1)
    .click();
}

async function selectMobileMapPin(page, index) {
  await page.locator(`.pin-${index}`).scrollIntoViewIfNeeded();
  await page.locator(`.pin-${index}`).click();
}

async function verifyMobileMapItem(page, details) {
  const container = page.locator(MOBILE_MAP_RESULT_CONTAINER).first();
  await expect(container).toBeVisible();
  await verifyListingContents(page, container, details);
}

async function awaitMapRender(page) {
  // Wait for map tiles to load
  await page.waitForTimeout(3000);
}

async function verifyElementExists(page, selector) {
  await expect(page.locator(selector).first()).toBeVisible();
}

async function verifyElementByText(page, text) {
  await expect(page.getByText(text).first()).toBeVisible();
}

async function scrollToThenVerifyElementByText(page, text) {
  const el = page.getByText(text).first();
  await el.scrollIntoViewIfNeeded();
  await expect(el).toBeVisible();
  return el;
}

async function verifyElementShouldContainText(page, selector, text) {
  const el = page.locator(selector).first();
  await expect(el).toBeVisible();
  await expect(el).toContainText(text);
}

async function verifyElementShouldContainString(page, selector, regex) {
  const el = page.locator(selector).first();
  await expect(el).toBeVisible();
  if (regex instanceof RegExp) {
    await expect(el).toHaveText(regex);
  } else {
    await expect(el).toContainText(regex);
  }
}

async function verifyElementDoesNotExist(page, selector) {
  await expect(page.locator(selector)).toHaveCount(0);
}

async function verifyElementIsNotDisabled(page, selector) {
  await expect(page.locator(selector)).not.toBeDisabled();
}

async function errorMessageContains(page, text) {
  await verifyElementShouldContainText(page, SEARCH_FORM_ERROR_MESSAGE, text);
}

async function errorMessageContains2(page, text) {
  await verifyElementShouldContainText(page, SEARCH_FORM_ERROR_MESSAGE_2, text);
}

async function elementIsFocused(page, selector) {
  await expect(page.locator(selector)).toBeFocused();
}

async function focusElement(page, selector) {
  await page.locator(selector).focus();
}

// --- Mock setup helpers ---

/**
 * Injects a WebGL stub so MapBox GL JS can initialize in headless Chromium.
 * Also mocks the Mapbox token health check and tile/style endpoints.
 */
async function setupMapboxStubs(page) {
  // WebGL context stub — prevents "Failed to initialize WebGL" from mapbox-gl
  await page.addInitScript(() => {
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function stubGetContext(
      type,
      attrs,
    ) {
      if (
        type === 'webgl' ||
        type === 'webgl2' ||
        type === 'experimental-webgl'
      ) {
        const handler = {
          get(target, prop) {
            if (prop in target) return target[prop];
            return function noOp() {
              return null;
            };
          },
        };
        // eslint-disable-next-line fp/no-proxy
        return new Proxy(
          {
            canvas: this,
            drawingBufferWidth: this.width || 300,
            drawingBufferHeight: this.height || 150,
            getExtension: () => null,
            getParameter: p => {
              if (p === 7938) return 'WebGL 1.0';
              return 0;
            },
            getShaderPrecisionFormat: () => ({
              rangeMin: 127,
              rangeMax: 127,
              precision: 23,
            }),
            createShader: () => ({}),
            shaderSource: () => {},
            compileShader: () => {},
            getShaderParameter: () => true,
            getShaderInfoLog: () => '',
            createProgram: () => ({}),
            attachShader: () => {},
            linkProgram: () => {},
            getProgramParameter: () => true,
            getProgramInfoLog: () => '',
            validateProgram: () => {},
            useProgram: () => {},
            createBuffer: () => ({}),
            bindBuffer: () => {},
            bufferData: () => {},
            bufferSubData: () => {},
            enableVertexAttribArray: () => {},
            disableVertexAttribArray: () => {},
            vertexAttribPointer: () => {},
            getAttribLocation: () => 0,
            getUniformLocation: () => ({}),
            getActiveAttrib: () => ({ name: 'a', size: 1, type: 5126 }),
            getActiveUniform: () => ({ name: 'u', size: 1, type: 5126 }),
            uniform1f: () => {},
            uniform1i: () => {},
            uniform2f: () => {},
            uniform2fv: () => {},
            uniform3f: () => {},
            uniform3fv: () => {},
            uniform4f: () => {},
            uniform4fv: () => {},
            uniformMatrix2fv: () => {},
            uniformMatrix3fv: () => {},
            uniformMatrix4fv: () => {},
            createTexture: () => ({}),
            bindTexture: () => {},
            texParameteri: () => {},
            texParameterf: () => {},
            texImage2D: () => {},
            texSubImage2D: () => {},
            activeTexture: () => {},
            createFramebuffer: () => ({}),
            bindFramebuffer: () => {},
            framebufferTexture2D: () => {},
            checkFramebufferStatus: () => 36053,
            createRenderbuffer: () => ({}),
            bindRenderbuffer: () => {},
            renderbufferStorage: () => {},
            framebufferRenderbuffer: () => {},
            viewport: () => {},
            clear: () => {},
            clearColor: () => {},
            clearDepth: () => {},
            clearStencil: () => {},
            enable: () => {},
            disable: () => {},
            blendFunc: () => {},
            blendFuncSeparate: () => {},
            blendEquation: () => {},
            blendEquationSeparate: () => {},
            blendColor: () => {},
            depthFunc: () => {},
            depthMask: () => {},
            depthRange: () => {},
            stencilFunc: () => {},
            stencilFuncSeparate: () => {},
            stencilMask: () => {},
            stencilMaskSeparate: () => {},
            stencilOp: () => {},
            stencilOpSeparate: () => {},
            scissor: () => {},
            colorMask: () => {},
            pixelStorei: () => {},
            generateMipmap: () => {},
            drawArrays: () => {},
            drawElements: () => {},
            finish: () => {},
            flush: () => {},
            getError: () => 0,
            isContextLost: () => false,
            getSupportedExtensions: () => [],
            lineWidth: () => {},
            polygonOffset: () => {},
            deleteTexture: () => {},
            deleteBuffer: () => {},
            deleteFramebuffer: () => {},
            deleteRenderbuffer: () => {},
            deleteShader: () => {},
            deleteProgram: () => {},
            readPixels: () => {},
            isEnabled: () => false,
            frontFace: () => {},
            cullFace: () => {},
            hint: () => {},
            sampleCoverage: () => {},
            // WebGL constants needed by mapbox-gl
            ARRAY_BUFFER: 34962,
            ELEMENT_ARRAY_BUFFER: 34963,
            STATIC_DRAW: 35044,
            DYNAMIC_DRAW: 35048,
            FLOAT: 5126,
            UNSIGNED_SHORT: 5123,
            UNSIGNED_BYTE: 5121,
            UNSIGNED_INT: 5125,
            TRIANGLES: 4,
            TRIANGLE_STRIP: 5,
            LINES: 1,
            LINE_STRIP: 3,
            POINTS: 0,
            TEXTURE_2D: 3553,
            TEXTURE0: 33984,
            RGBA: 6408,
            RGB: 6407,
            LUMINANCE: 6409,
            NEAREST: 9728,
            LINEAR: 9729,
            LINEAR_MIPMAP_LINEAR: 9987,
            NEAREST_MIPMAP_LINEAR: 9986,
            LINEAR_MIPMAP_NEAREST: 9985,
            NEAREST_MIPMAP_NEAREST: 9984,
            TEXTURE_MAG_FILTER: 10240,
            TEXTURE_MIN_FILTER: 10241,
            TEXTURE_WRAP_S: 10242,
            TEXTURE_WRAP_T: 10243,
            REPEAT: 10497,
            CLAMP_TO_EDGE: 33071,
            MIRRORED_REPEAT: 33648,
            FRAMEBUFFER: 36160,
            RENDERBUFFER: 36161,
            COLOR_ATTACHMENT0: 36064,
            DEPTH_ATTACHMENT: 36096,
            STENCIL_ATTACHMENT: 36128,
            DEPTH_STENCIL_ATTACHMENT: 33306,
            DEPTH_STENCIL: 34041,
            FRAMEBUFFER_COMPLETE: 36053,
            COLOR_BUFFER_BIT: 16384,
            DEPTH_BUFFER_BIT: 256,
            STENCIL_BUFFER_BIT: 1024,
            BLEND: 3042,
            DEPTH_TEST: 2929,
            STENCIL_TEST: 2960,
            SCISSOR_TEST: 3089,
            CULL_FACE: 2884,
            FRAGMENT_SHADER: 35632,
            VERTEX_SHADER: 35633,
            COMPILE_STATUS: 35713,
            LINK_STATUS: 35714,
            MAX_TEXTURE_SIZE: 3379,
            MAX_RENDERBUFFER_SIZE: 34024,
            UNPACK_FLIP_Y_WEBGL: 37440,
            UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
            SRC_ALPHA: 770,
            ONE_MINUS_SRC_ALPHA: 771,
            FUNC_ADD: 32774,
            NO_ERROR: 0,
          },
          handler,
        );
      }
      return origGetContext.call(this, type, attrs);
    };
  });

  // Dynamic Mapbox geocoding mock — returns city-specific coordinates
  // based on the search query in the URL, falling back to Austin, TX.
  const geocodingCities = {
    atlanta: {
      lat: 33.7508,
      lng: -84.389854,
      name: 'Atlanta',
      state: 'Georgia',
      abbr: 'GA',
    },
    tampa: {
      lat: 27.947973,
      lng: -82.4571,
      name: 'Tampa',
      state: 'Florida',
      abbr: 'FL',
    },
    norfolk: {
      lat: 36.8488,
      lng: -76.2929,
      name: 'Norfolk',
      state: 'Virginia',
      abbr: 'VA',
    },
    seattle: {
      lat: 47.6002,
      lng: -122.3201,
      name: 'Seattle',
      state: 'Washington',
      abbr: 'WA',
    },
    reno: {
      lat: 39.52578,
      lng: -119.81292,
      name: 'Reno',
      state: 'Nevada',
      abbr: 'NV',
    },
    tulsa: {
      lat: 36.15286,
      lng: -95.989395,
      name: 'Tulsa',
      state: 'Oklahoma',
      abbr: 'OK',
    },
    honolulu: {
      lat: 21.308498,
      lng: -157.86154,
      name: 'Honolulu',
      state: 'Hawaii',
      abbr: 'HI',
    },
    chicago: {
      lat: 41.881954,
      lng: -87.63236,
      name: 'Chicago',
      state: 'Illinois',
      abbr: 'IL',
    },
    juneau: {
      lat: 58.30035,
      lng: -134.40826,
      name: 'Juneau',
      state: 'Alaska',
      abbr: 'AK',
    },
  };
  const defaultGeocodingData = require('../../../constants/mock-geocoding-data.json');

  const buildGeocodingResponse = city => ({
    type: 'FeatureCollection',
    query: [city.name.toLowerCase()],
    features: [
      {
        id: `place.${city.name.toLowerCase()}`,
        type: 'Feature',
        place_type: ['place'], // eslint-disable-line camelcase
        relevance: 1,
        properties: {},
        text: city.name,
        place_name: `${city.name}, ${city.state}, United States`, // eslint-disable-line camelcase
        bbox: [
          city.lng - 0.75,
          city.lat - 0.75,
          city.lng + 0.75,
          city.lat + 0.75,
        ],
        center: [city.lng, city.lat],
        geometry: {
          type: 'Point',
          coordinates: [city.lng, city.lat],
        },
        context: [
          {
            id: `region.${city.abbr}`,
            short_code: `US-${city.abbr}`, // eslint-disable-line camelcase
            text: city.state,
          },
          {
            id: 'country.us',
            short_code: 'us', // eslint-disable-line camelcase
            text: 'United States',
          },
        ],
      },
    ],
    attribution: '',
  });

  await page.route(/api.mapbox.com/, route => {
    if (
      route
        .request()
        .url()
        .includes('/geocoding/')
    ) {
      const url = route.request().url();
      // Extract search query from URL: .../mapbox.places/{query}.json
      const queryMatch = url.match(/mapbox\.places\/([^.]+)\.json/);
      const searchQuery = queryMatch
        ? decodeURIComponent(queryMatch[1]).toLowerCase()
        : '';
      const matchedCity = Object.keys(geocodingCities).find(key =>
        searchQuery.includes(key),
      );

      const responseData = matchedCity
        ? buildGeocodingResponse(geocodingCities[matchedCity])
        : defaultGeocodingData;

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData),
      });
    }
    return route.fulfill({ status: 200, body: '' });
  });
}

async function setupCommonMocks(page, featureSet = []) {
  await setupMapboxStubs(page);
  await page.route('**/v0/feature_toggles*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { features: featureSet } }),
    }),
  );
  await page.route(/maintenance_windows/, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    }),
  );
}

module.exports = {
  ROOT_URL,
  MAP_CONTAINER,
  CITY_STATE_ZIP_INPUT,
  FACILITY_TYPE_DROPDOWN,
  VA_HEALTH_SERVICE_DROPDOWN,
  CCP_SERVICE_TYPE_INPUT,
  SEARCH_BUTTON,
  SEARCH_AVAILABLE,
  NO_SERVICE,
  AUTOSUGGEST_ADDRESS_INPUT,
  AUTOSUGGEST_ADDRESS_CONTAINER,
  AUTOSUGGEST_ADDRESS_OPTIONS,
  AUTOSUGGEST_INPUT,
  AUTOSUGGEST_ARROW,
  AUTOSUGGEST_CLEAR,
  OPTIONS,
  FACILITY_LISTING_CONTAINER,
  FACILITY_DISTANCE,
  FACILITY_ADDRESS,
  DIRECTIONS_LINK,
  MAIN_PHONE,
  VA_HEALTH_CONNECT_NUMBER,
  MENTAL_HEALTH_NUMBER,
  TTY_NUMBER,
  SEARCH_RESULTS_SUMMARY,
  MOBILE_MAP_PIN_SELECT_HELP_TEXT,
  MOBILE_MAP_NO_RESULTS_TEXT,
  MOBILE_LIST_SEARCH_TEXT,
  MOBILE_TAB_BUTTON,
  MOBILE_MAP_RESULT_CONTAINER,
  SEARCH_FORM_ERROR_MESSAGE,
  SEARCH_FORM_ERROR_MESSAGE_2,
  FACILITY_TYPES,
  typeInCityStateInput,
  typeInAutosuggestInput,
  typeAndSelectInCCPServiceTypeInput,
  typeInCCPServiceTypeInput,
  clearInput,
  vaSelectSelect,
  selectFacilityTypeInDropdown,
  selectServiceTypeInVAHealthDropdown,
  submitSearchForm,
  clickElement,
  verifyMainNumber,
  verifyHealthConnectNumber,
  verifyMentalHealthNumber,
  verifyTTYNumber,
  verifyListingContents,
  verifyMobileListItem,
  selectMobileMapTab,
  selectMobileMapPin,
  verifyMobileMapItem,
  awaitMapRender,
  verifyElementExists,
  verifyElementByText,
  scrollToThenVerifyElementByText,
  verifyElementShouldContainText,
  verifyElementShouldContainString,
  verifyElementDoesNotExist,
  verifyElementIsNotDisabled,
  errorMessageContains,
  errorMessageContains2,
  elementIsFocused,
  focusElement,
  setupMapboxStubs,
  setupCommonMocks,
};
