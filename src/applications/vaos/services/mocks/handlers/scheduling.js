const schedulingConfigurationsVPG = require('../v2/scheduling_configurations_vpg.json');
// const schedulingConfigurationsCC = require('./v2/scheduling_configurations_cc.json');
// const schedulingConfigurations = require('./v2/scheduling_configurations.json');

const responses = {
  'GET /vaos/v2/scheduling/configurations': (req, res) => {
    if (req.query.cc_enabled === 'true') {
      // Return VPG scheduling configurations
      return res.json(schedulingConfigurationsVPG);
      // return res.json(schedulingConfigurationsCC);
    }

    // Return VPG scheduling configurations
    return res.json(schedulingConfigurationsVPG);
    // return res.json(schedulingConfigurations);
  },
};
module.exports = responses;
