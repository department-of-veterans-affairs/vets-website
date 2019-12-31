const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'regional_health_care_service_des',
    fieldBody: getDrupalValue(entity.fieldBody),
    fieldServiceNameAndDescripti: getDrupalValue(
      entity.fieldServiceNameAndDescripti,
    ),
  },
});
module.exports = {
  filter: ['field_body', 'field_service_name_and_descripti'],
  transform,
};
