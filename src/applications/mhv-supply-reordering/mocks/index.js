const delay = require('mocker-api/lib/delay');
const user = require('./user/index');
const featureToggles = require('./feature-toggles/index');
const mdot = require('./mdot/index');

const mdotResponse = mdot.response(mdot.MDOT_USERS.WITH_SUPPLIES);

const responses = {
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles(),
  'GET /v0/in_progress_forms/mdot': (req, res) => {
    return res.status(mdotResponse.status).json(mdotResponse.data);
  },
};

module.exports = delay(responses, 2000);
