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
