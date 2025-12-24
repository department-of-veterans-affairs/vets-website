/**
 * Function to mock the 'GET' referrals endpoint.
 *
 * @example GET '/vaos/v2/referrals'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockReferralsGetApi({
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/referrals',
    },
    req => {
      req.reply({
        statusCode: responseCode,
        body: data,
      });
    },
  ).as('v2:get:referrals');
}

/**
 * Function to mock the 'GET' referral detail endpoint.
 *
 * @example GET '/vaos/v2/referrals/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {string} [arguments.id] - The id of the referral to mock.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockReferralDetailGetApi({
  id = '*',
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/referrals/${id}`,
    },
    req => {
      req.reply({
        statusCode: responseCode,
        body: data,
      });
    },
  ).as('v2:get:referral:detail');
}

/**
 * Function to mock the 'GET' epsApi appointment details endpoint with polling behavior.
 * Returns the first response for the specified number of requests, then switches to the second response.
 *
 * @example GET '/vaos/v2/epsApi/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {string} [arguments.id] - The ID of the appointment to get details for.
 * @param {Object} [arguments.firstResponse] - The response to return for the initial requests.
 * @param {Object} [arguments.secondResponse] - The response to return after the initial requests.
 * @param {number} [arguments.switchAfterRequests=1] - Number of requests before switching to second response.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentDetailsApiWithPolling({
  id = '*',
  firstResponse,
  secondResponse,
  switchAfterRequests = 1,
  responseCode = 200,
} = {}) {
  let requestCount = 0;

  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/eps_appointments/${id}`,
    },
    req => {
      requestCount += 1;

      const responseData =
        requestCount <= switchAfterRequests ? firstResponse : secondResponse;

      req.reply({
        statusCode: responseCode,
        body: responseData,
      });
    },
  ).as('v2:get:appointmentDetails:polling');
}

/**
 * Function to mock the 'POST' draft referral appointment endpoint.
 *
 * @example POST '/vaos/v2/epsApi/draftReferralAppointment'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockDraftReferralAppointmentApi({
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vaos/v2/appointments/draft',
    },
    req => {
      req.reply({
        statusCode: responseCode,
        body: data,
      });
    },
  ).as('v2:post:draftReferralAppointment');
}

/**
 * Function to mock the 'POST' epsApi appointments creation endpoint.
 *
 * @example POST '/vaos/v2/epsApi/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockCreateAppointmentApi({
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vaos/v2/appointments',
    },
    req => {
      req.reply({
        statusCode: responseCode,
        body: data,
      });
    },
  ).as('v2:post:createAppointment');
}

/**
 * Function to mock the 'POST' submit appointment endpoint.
 *
 * @example POST '/vaos/v2/appointments/submit'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockSubmitAppointmentApi({
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vaos/v2/appointments/submit',
    },
    req => {
      req.reply({
        statusCode: responseCode,
        body: data,
      });
    },
  ).as('v2:post:submitAppointment');
}

/**
 * Function to mock the 'GET' epsApi appointment details endpoint.
 *
 * @example GET '/vaos/v2/epsApi/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {string} [arguments.id] - The ID of the appointment to get details for.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentDetailsApi({
  id = '*',
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/eps_appointments/${id}`,
    },
    req => {
      req.reply({
        statusCode: responseCode,
        body: data,
      });
    },
  ).as('v2:get:appointmentDetails');
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
