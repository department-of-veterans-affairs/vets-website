const patientProviderRelationships = require('../v2/patient_provider_relationships.json');

const responses = {
  'GET /vaos/v2/relationships': (req, res) => {
    return res.json(patientProviderRelationships);
  },
};
module.exports = responses;
