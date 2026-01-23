const {
  isAfter,
  differenceInMinutes,
  isValid,
  isWithinInterval,
} = require('date-fns');
const { APPOINTMENT_STATUS } = require('../../../../utils/constants');
const requests = require('../../v2/requests.json');
const requestsOh = require('../../v2/requests_oh.json');
const confirmed = require('../../v2/confirmed.json');

// Returns the meta object without any backend service errors
const meta = require('../../v2/meta.json');
// Uncomment to produce backend service errors
// const meta = require('../../v2/meta_failures.json');

function getAppointmentsHandler(req, res) {
  // merge arrays together
  const responses = {
    data: confirmed.data
      .concat(requests.data)
      .concat(requestsOh.data)
      .concat(global.database),
  };

  for (const response of responses.data) {
    if (
      response.attributes.start &&
      !response.attributes.referral?.referralNumber
    ) {
      response.attributes.future = isAfter(
        new Date(response.attributes.start),
        new Date(),
      );

      if (response.attributes.modality === 'vaVideoCareAtHome') {
        const diff = differenceInMinutes(
          new Date(),
          new Date(response.attributes.start),
        );

        if (!response.attributes.telehealth) {
          response.attributes.telehealth = {};
        }

        response.attributes.telehealth.displayLink = diff > -30 && diff < 240;
      }
    }
  }

  const filteredResponses = responses.data.filter(response => {
    return req.query.statuses.some(status => {
      if (response.attributes.status === status) {
        // Automatically add appointments with these statuses to the collection
        if (
          response.id.startsWith('mock') ||
          response.attributes.status === APPOINTMENT_STATUS.cancelled
        )
          return true;

        const { requestedPeriods } = response.attributes;
        let date;

        if (status === APPOINTMENT_STATUS.proposed) {
          if (Array.isArray(requestedPeriods) && requestedPeriods.length > 0) {
            date = new Date(requestedPeriods[0].start);
          }
        } else if (status === APPOINTMENT_STATUS.booked) {
          date = new Date(response.attributes.start);
        }

        if (
          isValid(date) &&
          isWithinInterval(date, {
            start: new Date(req.query.start),
            end: new Date(req.query.end),
          })
        ) {
          return true;
        }
      }
      return false;
    });
  });

  return res.json({ data: filteredResponses, meta });
}
exports.getAppointmentsHandler = getAppointmentsHandler;
