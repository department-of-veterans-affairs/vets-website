const {
  getDrupalValue,
  getTimeAsSeconds,
  createMetaTag,
} = require('./helpers');

const transform = entity => {
  const {
    metatag: { value: metaTags },
  } = entity;
  return {
    entityType: 'node',
    entityBundle: 'health_care_region_detail_page',
    title: getDrupalValue(entity.title),

    changed: getTimeAsSeconds(getDrupalValue(entity.changed)),
    entityMetatags: [
      createMetaTag('MetaValue', 'title', metaTags.title),
      createMetaTag('MetaValue', 'twitter:card', 'summary_large_image'),
      createMetaTag('MetaProperty', 'og:site_name', metaTags.og_site_name),
      createMetaTag(
        'MetaValue',
        'twitter:description',
        metaTags.twitter_cards_description,
      ),
      createMetaTag('MetaValue', 'description', metaTags.description),
      createMetaTag('MetaValue', 'twitter:title', metaTags.twitter_cards_title),

      createMetaTag('MetaValue', 'twitter:site', metaTags.twitter_cards_site),
      createMetaTag('MetaProperty', 'og:title', metaTags.og_title),
      createMetaTag('MetaProperty', 'og:description', metaTags.og_description),
    ],
    entityUrl: {
      path: entity.path[0].alias,
    },
    fieldAlert: getDrupalValue(entity.fieldAlert),
    fieldContentBlock: entity.fieldContentBlock,
    fieldFeaturedContent: entity.fieldFeaturedContent,
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldOffice: entity.fieldOffice[0],
    fieldRelatedLinks: entity.fieldRelatedLinks[0],
    fieldTableOfContentsBoolean: getDrupalValue(
      entity.fieldTableOfContentsBoolean,
    ),
  };
};
module.exports = {
  filter: [
    'title',
    'changed',
    'metatag',
    'path',
    'field_alert',
    'field_content_block',
    'field_featured_content',
    'field_intro_text',
    'field_office',
    'field_related_links',
    'field_table_of_contents_boolean',
  ],
  transform,
};
