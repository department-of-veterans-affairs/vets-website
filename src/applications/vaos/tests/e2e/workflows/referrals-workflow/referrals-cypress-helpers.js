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
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: responseCode,
        });
        return;
      }

      req.reply({
        statusCode: 200,
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
      if (responseCode !== 200) {
        req.reply({
          statusCode: responseCode,
          body:
            responseCode === 404
              ? { errors: [{ title: 'Referral not found', status: '404' }] }
              : {
                  errors: [
                    {
                      title: 'Error retrieving referral',
                      status: responseCode.toString(),
                    },
                  ],
                },
        });
        return;
      }

      req.reply({
        statusCode: 200,
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
      pathname: '/vaos/v2/epsApi/draftReferralAppointment',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          statusCode: responseCode,
          body: data,
        });
        return;
      }

      req.reply({
        statusCode: 200,
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
      pathname: '/vaos/v2/epsApi/appointments',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          statusCode: responseCode,
          body: data,
        });
        return;
      }

      req.reply({
        statusCode: 200,
        body: data,
      });
    },
  ).as('v2:post:createAppointment');
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
      pathname: `/vaos/v2/epsApi/appointments/${id}`,
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          statusCode: responseCode,
          body: data,
        });
        return;
      }

      req.reply({
        statusCode: 200,
        body: data,
      });
    },
  ).as('v2:get:appointmentDetails');
}
