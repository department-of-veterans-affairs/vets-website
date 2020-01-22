const { getDrupalValue, utcToEpochTime } = require('./helpers');

// Same as the createMetaTag in the transformer helpers, but uses
// __typename instead of type. Because consistency.
function createMetaTag(type, key, value) {
  return {
    __typename: type,
    key,
    value,
  };
}

const transform = entity => {
  const metaTags = entity.metatag.value;

  return {
    entityType: 'node',
    entityBundle: 'event_listing',
    entityUrl: {
      // TODO: Get the breadcrumb from the CMS export when it's available
      breadcrumb: [],
      path: entity.path[0].alias,
    },
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
      createMetaTag('MetaProperty', 'og:title', metaTags.og_title),
      createMetaTag('MetaProperty', 'og:description', metaTags.og_description),
    ],
    title: getDrupalValue(entity.title),
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    metatag: getDrupalValue(entity.metatag),
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldOffice: entity.fieldOffice[0],
  };
};
module.exports = {
  filter: [
    'title',
    'changed',
    'metatag',
    'path',
    'field_intro_text',
    'field_office',
  ],
  transform,
};
