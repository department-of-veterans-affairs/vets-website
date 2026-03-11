import MockRequestOtpResponse from '../fixtures/MockRequestOtpResponse';
import MockAuthenticateOtpResponse from '../fixtures/MockAuthenticateOtpResponse';
import MockAppointmentAvailabilityResponse from '../fixtures/MockAppointmentAvailabilityResponse';
import MockTopicsResponse from '../fixtures/MockTopicsResponse';
import MockCreateAppointmentResponse from '../fixtures/MockCreateAppointmentResponse';
import MockAppointmentDetailsResponse from '../fixtures/MockAppointmentDetailsResponse';
import MockCancelAppointmentResponse from '../fixtures/MockCancelAppointmentResponse';

/**
 * Patches document.cookie to strip `Secure` and `Domain` attributes.
 *
 * In the vagovprod build, VASS cookies are set with
 *   { secure: true, domain: 'va.gov', sameSite: 'strict' }
 * which prevents the cookie from being stored when the Cypress test server
 * runs on http://127.0.0.1 (not HTTPS, not va.gov).
 *
 * Call this in a `beforeEach` **before** `cy.visit()` so the patch is in
 * place before application code runs.
 *
 * @export
 */
export function patchCookiesForCI() {
  cy.on('window:before:load', win => {
    const cookieDesc = Object.getOwnPropertyDescriptor(
      win.Document.prototype,
      'cookie',
    );

    if (cookieDesc && cookieDesc.set) {
      Object.defineProperty(win.document, 'cookie', {
        get() {
          return cookieDesc.get.call(this);
        },
        set(value) {
          // Strip attributes that prevent cookie storage in CI
          const cleaned = value.replace(/;\s*[Ss]ecure/g, '');
          cookieDesc.set.call(this, cleaned);
        },
        configurable: true,
      });
    }
  });
}

/**
 * Function to mock the 'POST' request-otp endpoint.
 *
 * @example POST '/vass/v0/request-otp'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockRequestOtpApi({
  response = new MockRequestOtpResponse().toJSON(),
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vass/v0/request-otp',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:post:request-otp');
}

/**
 * Function to mock the 'POST' authenticate-otp endpoint.
 *
 * @example POST '/vass/v0/authenticate-otp'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {string} [arguments.uuid='mock-uuid'] - UUID of the user.
 * @param {number} [arguments.expiresIn=3600] - Token expiration in seconds (1 hour).
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAuthenticateOtpApi({
  response = new MockAuthenticateOtpResponse({
    uuid: 'mock-uuid',
    expiresIn: 3600,
  }).toJSON(),
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vass/v0/authenticate-otp',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:post:authenticate-otp');
}

/**
 * Function to mock the 'GET' appointment-availability endpoint.
 *
 * @example GET '/vass/v0/appointment-availability'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentAvailabilityApi({
  response = new MockAppointmentAvailabilityResponse({
    availableSlots: MockAppointmentAvailabilityResponse.createSlots(),
  }).toJSON(),
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vass/v0/appointment-availability',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:get:appointment-availability');
}

/**
 * Function to mock the 'GET' topics endpoint.
 *
 * @example GET '/vass/v0/topics'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockTopicsApi({
  response = new MockTopicsResponse({
    topics: MockTopicsResponse.createDefaultTopics(),
  }).toJSON(),
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vass/v0/topics',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:get:topics');
}

/**
 * Function to mock the 'POST' appointment endpoint (create appointment).
 *
 * @example POST '/vass/v0/appointment'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockCreateAppointmentApi({
  response = new MockCreateAppointmentResponse().toJSON(),
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vass/v0/appointment',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:post:appointment');
}

/**
 * Function to mock the 'GET' appointment details endpoint.
 *
 * @example GET '/vass/v0/appointment/:appointmentId'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentDetailsApi({
  response = new MockAppointmentDetailsResponse().toJSON(),
  responseCode = 200,
} = {}) {
  const { appointmentId } = response.data ?? {};
  const pathPattern = appointmentId
    ? `/vass/v0/appointment/${appointmentId}`
    : /\/vass\/v0\/appointment\/[^/]+$/;

  cy.intercept(
    {
      method: 'GET',
      pathname: pathPattern,
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:get:appointment-details');
}

/**
 * Function to mock the 'POST' cancel appointment endpoint.
 *
 * @example POST '/vass/v0/appointment/:appointmentId/cancel'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockCancelAppointmentApi({
  response = new MockCancelAppointmentResponse().toJSON(),
  responseCode = 200,
} = {}) {
  const { appointmentId } = response.data ?? {};
  const pathPattern = appointmentId
    ? `/vass/v0/appointment/${appointmentId}/cancel`
    : /\/vass\/v0\/appointment\/[^/]+\/cancel$/;

  cy.intercept(
    {
      method: 'POST',
      pathname: pathPattern,
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: response,
          statusCode: responseCode,
        });
        return;
      }

      req.reply(response);
    },
  ).as('vass:post:cancel-appointment');
}

/**
 * Selector for the main scrollable container element.
 * Used to manipulate scroll behavior for full-page screenshots.
 */
const SCROLLER = 'body';

/**
 * Expands the scroll container to its full content height before taking a screenshot.
 *
 * By default, Cypress screenshots only capture the visible viewport. This function
 * temporarily modifies the scroll container's styles to make all content visible
 * by setting the height to the full scroll height and removing overflow constraints.
 *
 * The original styles are saved to a Cypress alias (`scrollerPrevStyles`) so they
 * can be restored after the screenshot is taken.
 *
 * @private
 */
function expandScrollerForShot() {
  cy.get(SCROLLER).then($el => {
    const el = $el[0];
    const prev = {
      height: el.style.height,
      overflow: el.style.overflow,
      maxHeight: el.style.maxHeight,
    };

    el.style.height = `${el.scrollHeight}px`;
    el.style.maxHeight = 'none';
    el.style.overflow = 'visible';

    cy.wrap(prev, { log: false }).as('scrollerPrevStyles');
  });
}

/**
 * Restores the scroll container's original styles after a screenshot is taken.
 *
 * This function retrieves the previously saved styles from the `scrollerPrevStyles`
 * Cypress alias and applies them back to the scroll container, returning the page
 * to its normal scrollable state.
 *
 * @private
 */
function restoreScrollerAfterShot() {
  cy.get('@scrollerPrevStyles').then(prev => {
    cy.get(SCROLLER).then($el => {
      const el = $el[0];
      el.style.height = prev.height;
      el.style.maxHeight = prev.maxHeight;
      el.style.overflow = prev.overflow;
    });
  });
}

/**
 * Saves a screenshot of the current page.
 *
 * Screenshots are disabled by default. Pass `--env screenshots=vass` to enable them.
 * Use `--env screenshots=all` to capture screenshots for all apps.
 *
 * @param {string} name - The name of the screenshot. Must be in the format of 'appName_featureName'.
 * @param {Object} [options] - The options for the screenshot.
 * @param {string} [options.overwrite=true] - Whether to overwrite the screenshot if it already exists.
 * @param {string} [options.capture='fullPage'] - The capture mode for the screenshot.
 */
export function saveScreenshot(
  name,
  options = { overwrite: true, capture: 'fullPage' },
) {
  const screenshotOptions = Cypress.env('screenshots');
  if (!screenshotOptions) {
    return;
  }

  const optionsSet = new Set(screenshotOptions.split(','));

  const [appName, featureName] = name.split('_');

  if (
    !optionsSet.has(appName) &&
    !optionsSet.has(featureName) &&
    screenshotOptions !== 'all'
  ) {
    return;
  }

  if (options.capture === 'fullPage') {
    expandScrollerForShot();
  }
  cy.screenshot(name, options);
  if (options.capture === 'fullPage') {
    restoreScrollerAfterShot();
  }
}
