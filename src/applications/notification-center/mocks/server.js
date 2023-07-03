const delay = require('mocker-api/lib/delay');
const { generateFeatureToggles } = require('./feature-toggles');
const user = require('./users');
const notifications = require('./notifications');

/* eslint-disable camelcase */
const responses = {
  'GET /v0/feature_toggles': generateFeatureToggles({
    myVaUseExperimental: true,
    showMyVADashboardV2: true,
  }),
  'GET /v0/user': user.cernerUser,
  'GET /v0/onsite_notifications': notifications.hasMultiple,
  // TODO: put id into a constant file when we get more notification types
  'PATCH /v0/onsite_notifications/:id': (req, res) => {
    const { id } = req.params;

    if (
      id === 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a' ||
      id === 'f9947b27-df3b-4b09-875c-7f76594d766d'
    ) {
      return res.json(notifications.createDismissalSuccessResponse(id));
    }
    if (!id) {
      return notifications.hasError;
    }

    return res.json({ data: [] });
  },
};

module.exports = delay(responses, 100);
