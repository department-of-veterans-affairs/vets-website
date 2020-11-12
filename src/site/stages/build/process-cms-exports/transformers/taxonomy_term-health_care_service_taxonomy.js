const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'taxonomy_term',
    entityBundle: 'health_care_service_taxonomy',
    name: getDrupalValue(entity.name),
    description: {
      processed: getWysiwygString(getDrupalValue(entity.description)),
    },
    parent: [
      {
        entity: {
          name: entity.parent[0].entity ? entity.parent[0].entity.name : '',
          weight: entity.parent[0].entity
            ? entity.parent[0].entity.weight
            : null,
        },
      },
    ],
    fieldAlsoKnownAs: getDrupalValue(entity.fieldAlsoKnownAs),
    fieldCommonlyTreatedCondition: getDrupalValue(
      entity.fieldCommonlyTreatedCondition,
    ),
    fieldHealthServiceApiId: getDrupalValue(entity.fieldHealthServiceApiId),
    weight: getDrupalValue(entity.weight),
  },
});
module.exports = {
  filter: [
    'name',
    'description',
    'parent',
    'field_also_known_as',
    'field_commonly_treated_condition',
    'field_health_service_api_id',
    'weight',
  ],
  transform,
};
