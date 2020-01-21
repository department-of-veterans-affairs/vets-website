const { getDrupalValue } = require('./helpers');

function createMetaTag(type, key, value) {
  return {
    __typename: type,
    key,
    value,
  };
}

const transform = ({
  title,
  path,
  moderationState,
  metatag: { value: metaTags },
  fieldNicknameForThisFacility,
}) => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_region_page',
    entityPublished: getDrupalValue(moderationState) === 'published',
    entityLabel: getDrupalValue(title),
    title: getDrupalValue(title),
    entityUrl: {
      path: path[0].alias,
    },
    fieldNicknameForThisFacility: getDrupalValue(fieldNicknameForThisFacility),
    entityMetatags: [
      createMetaTag('MetaValue', 'title', metaTags.title),
      createMetaTag('MetaValue', 'twitter:card', metaTags.twitter_cards_type),
      createMetaTag('MetaProperty', 'og:site_name', metaTags.og_site_name),
      createMetaTag(
        'MetaValue',
        'twitter:description',
        metaTags.twitter_cards_description,
      ),
      createMetaTag('MetaValue', 'description', metaTags.description),
      createMetaTag('MetaValue', 'twitter:title', metaTags.twitter_cards_title),
      createMetaTag('MetaValue', 'twitter:site', metaTags.twitter_cards_site),
      createMetaTag('MetaLink', 'image_src', metaTags.image_src),
      createMetaTag('MetaProperty', 'og:title', metaTags.og_title),
      createMetaTag('MetaProperty', 'og:description', metaTags.og_description),

      createMetaTag('MetaValue', 'twitter:image', metaTags.twitter_cards_image),

      createMetaTag('MetaProperty', 'og:image', metaTags.og_image_0),
    ],
  },
});
module.exports = {
  filter: [
    'title',
    'moderation_state',
    'path',
    'field_nickname_for_this_facility',
    'metatag',
  ],
  transform,
};
