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
