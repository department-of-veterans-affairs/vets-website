const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_local_health_service',
    fieldBody: {
      processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
    },
    fieldRegionalHealthService: entity.fieldRegionalHealthService[0] || null,
  },
});
module.exports = {
  filter: ['field_body', 'field_regional_health_service'],
  transform,
};
