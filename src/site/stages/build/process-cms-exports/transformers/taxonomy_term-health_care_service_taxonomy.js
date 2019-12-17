const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'taxonomy_term',
    entityBundle: 'health_care_service_taxonomy',
    name: getDrupalValue(entity.name),
    description: { processed: getDrupalValue(entity.description) },
    parent: [
      {
        entity: {
          name: getDrupalValue(entity.parent.name),
        },
      },
    ],
    fieldAlsoKnownAs: getDrupalValue(entity.fieldAlsoKnownAs),
    fieldCommonlyTreatedCondition: getDrupalValue(
      entity.fieldCommonlyTreatedCondition,
    ),
    fieldHealthServiceApiId: getDrupalValue(entity.fieldHealthServiceApiId),
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
  ],
  transform,
};
