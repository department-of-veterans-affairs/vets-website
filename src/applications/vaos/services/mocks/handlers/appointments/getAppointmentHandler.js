const { isAfter } = require('date-fns');
const requests = require('../../v2/requests.json');
const requestsOH = require('../../v2/requests_oh.json');
const confirmed = require('../../v2/confirmed.json');

function getAppointmentHandler(req, res) {
  const responses = {
    data: confirmed.data
      .concat(requests.data)
      .concat(requestsOH.data)
      .concat(global.database),
  };

  const response = responses.data.find(resp => resp.id === req.params.id);

  if (response?.start && !response.referral?.referralNumber) {
    response.future = isAfter(new Date(response.start), new Date());
  }
  return res.json({
    data: response,
  });
}
exports.getAppointmentHandler = getAppointmentHandler;
