const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_local_health_service',
    fieldBody: getDrupalValue(entity.fieldBody),
    fieldRegionalHealthService: entity.fieldRegionalHealthService,
  },
});
module.exports = {
  filter: ['field_body', 'field_regional_health_service'],
  transform,
};
