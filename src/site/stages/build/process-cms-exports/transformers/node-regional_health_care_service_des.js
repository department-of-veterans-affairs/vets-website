const { getDrupalProcessed, getWysiwygString } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'regional_health_care_service_des',
    fieldBody: {
      processed: getWysiwygString(getDrupalProcessed(entity.fieldBody)),
    },
    fieldServiceNameAndDescripti: entity.fieldServiceNameAndDescripti[0],
  },
});
module.exports = {
  filter: ['field_body', 'field_service_name_and_descripti'],
  transform,
};
