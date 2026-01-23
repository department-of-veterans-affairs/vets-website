const ccProviders = require('../v2/cc_providers.json');
// Comment out line above and uncomment line below to test relationship endpoint error states
// const patientProviderRelationships = require('./v2/patient_provider_relationships_errors.json');

const responses = {
  'GET /facilities_api/v2/ccp/provider': ccProviders,
};
module.exports = responses;
