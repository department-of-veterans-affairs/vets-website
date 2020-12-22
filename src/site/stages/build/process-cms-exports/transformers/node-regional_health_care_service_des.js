const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'regional_health_care_service_des',
  fieldBody: {
    processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
  },
  fieldServiceNameAndDescripti: entity.fieldServiceNameAndDescripti[0],
  fieldLocalHealthCareService: entity.fieldLocalHealthCareService?.map(i => ({
    entity: {
      entityUrl: i.entityUrl,
      entityId: i.entityId,
      title: i?.entity?.title,
      fieldFacilityLocation: i?.entity?.fieldFacilityLocation,
    },
  })),
});
module.exports = {
  filter: [
    'field_body',
    'field_service_name_and_descripti',
    'field_local_health_care_service_',
  ],
  transform,
};
