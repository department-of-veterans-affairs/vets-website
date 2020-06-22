/* eslint-disable camelcase */
const entref = require('../common/entref');

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    field_administration: entref('taxonomy_term'),
    field_facility_locator_api_id: { $ref: 'GenericNestedString' },
    field_operating_status_facility: { $ref: 'GenericNestedString' },
    field_operating_status_more_info: { $ref: 'GenericNestedString' },
  },
};
