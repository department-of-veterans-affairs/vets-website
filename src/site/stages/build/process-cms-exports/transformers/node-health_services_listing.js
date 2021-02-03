const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'health_services_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  promote: getDrupalValue(entity.promote),
  sticky: getDrupalValue(entity.sticky),
  defaultLangcode: getDrupalValue(entity.defaultLangcode),
  revisionTranslationAffected: getDrupalValue(
    entity.revisionTranslationAffected,
  ),
  moderationState: getDrupalValue(entity.moderationState),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  path: getDrupalValue(entity.path),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldFeaturedContentHealthser: entity.fieldFeaturedContentHealthser,
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice:
    entity.fieldOffice[0] &&
    !ancestors.find(r => r.entity.uuid === entity.fieldOffice[0].uuid)
      ? {
          entity: {
            entityUrl: entity.fieldOffice[0].entityUrl,
            entityLabel: entity.fieldOffice[0].entityLabel,
            entityType: entity.fieldOffice[0].entityType,
            title: entity.fieldOffice[0].title,
            reverseFieldRegionPageNode: {
              entities: entity.fieldOffice[0].reverseFieldRegionPageNode
                ? entity.fieldOffice[0].reverseFieldRegionPageNode.entities.filter(
                    reverseField =>
                      reverseField.entityBundle ===
                      'regional_health_care_service_des',
                  )
                : [],
            },
          },
        }
      : null,
});

module.exports = {
  filter: [
    'title',
    'created',
    'promote',
    'sticky',
    'default_langcode',
    'revision_translation_affected',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_featured_content_healthser',
    'field_intro_text',
    'field_meta_title',
    'field_office',
  ],
  transform,
  getCacheKey: (entity, { ancestors }) => {
    const hasCircularReference =
      entity.field_office[0] &&
      !ancestors.find(
        r => r.entity.uuid === entity.field_office[0].target_uuid,
      );
    return `${entity.uuid}-${hasCircularReference ? 'true' : 'false'}`;
  },
};
