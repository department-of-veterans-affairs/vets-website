const { getDrupalValue, createLink } = require('./helpers');

const transform = entity => {
  const fsml = entity.fieldSocialMediaLinks[0];

  return {
    targetId: getDrupalValue(entity.tid),
    entity: {
      entityType: 'taxonomy_term',
      entityBundle: 'administration',
      entityLabel: getDrupalValue(entity.name),
      name: getDrupalValue(entity.name),
      fieldAcronym: getDrupalValue(entity.fieldAcronym),
      fieldDescription: getDrupalValue(entity.fieldDescription),
      fieldEmailUpdatesLinkText: getDrupalValue(
        entity.fieldEmailUpdatesLinkText,
      ),
      fieldEmailUpdatesUrl: getDrupalValue(entity.fieldEmailUpdatesUrl),
      fieldIntroText: getDrupalValue(entity.fieldIntroText),
      fieldLink: createLink(entity.fieldLink, ['url']),
      fieldSocialMediaLinks: {
        platform: fsml.platform,
        value: fsml.value,
        platformValues: JSON.stringify(fsml.platform_values),
      },
    },
  };
};
module.exports = {
  filter: [
    'tid',
    'name',
    'field_acronym',
    'field_description',
    'field_email_updates_link_text',
    'field_email_updates_url',
    'field_intro_text',
    'field_link',
    'field_social_media_links',
  ],
  transform,
};
