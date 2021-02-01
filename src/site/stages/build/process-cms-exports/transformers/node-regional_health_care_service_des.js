/* eslint-disable camelcase */
const { getDrupalValue, getWysiwygString } = require('./helpers');

const getFieldFacilityLocationObject = ({
  entity,
  title,
  entityUrl,
  field_facility_location,
}) => {
  const fieldFacilityTitle =
    field_facility_location && field_facility_location[0]?.title
      ? field_facility_location[0].title
      : '';
  const fieldFacilityUrl =
    field_facility_location && field_facility_location[0]?.entityUrl
      ? field_facility_location[0].entityUrl
      : '';
  return typeof title === 'object'
    ? {
        entity: {
          title: getDrupalValue(title),
          fieldFacilityLocation: {
            entity: {
              title: getDrupalValue(fieldFacilityTitle),
              entityUrl: fieldFacilityUrl,
            },
          },
          entityUrl,
        },
      }
    : {
        entity: {
          title: entity?.title,
          fieldFacilityLocation: entity?.fieldFacilityLocation,
          entityUrl,
        },
      };
};

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'regional_health_care_service_des',
  fieldBody: {
    processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
  },
  fieldServiceNameAndDescripti: entity.fieldServiceNameAndDescripti[0],
  fieldLocalHealthCareService: entity.fieldLocalHealthCareService?.map(i =>
    getFieldFacilityLocationObject(i),
  ),
});
module.exports = {
  filter: [
    'field_body',
    'field_service_name_and_descripti',
    'field_local_health_care_service_',
  ],
  transform,
};
