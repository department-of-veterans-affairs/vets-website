const { isAfter } = require('date-fns');
const requests = require('../../v2/requests.json');
const requestsOh = require('../../v2/requests_oh.json');
const confirmed = require('../../v2/confirmed.json');

function putAppointmentHandler(req, res) {
  const responses = {
    data: confirmed.data
      .concat(requests.data)
      .concat(requestsOh.data)
      .concat(global.database),
  };

  const response = responses.find(item => item.id === req.params.id);
  if (req.body.status === 'cancelled') {
    response.attributes.status = 'cancelled';
    response.attributes.cancelationReason = { coding: [{ code: 'pat' }] };
    response.attributes.cancellable = false;
    if (response.attributes.start) {
      response.attributes.future = isAfter(
        new Date(response.attributes.start),
        new Date(),
      );
    }
  }

  return res.json({
    data: {
      id: req.params.id,
      attributes: {
        ...response.attributes,
        ...req.body,
      },
    },
  });
}
exports.putAppointmentHandler = putAppointmentHandler;
