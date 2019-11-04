const { flatten, isEmpty } = require('lodash');
const { getDrupalValue } = require('./helpers');

function createMetaTag(type, key, value) {
  return {
    type,
    key,
    value,
  };
}

function pageTransform(entity) {
  const transformed = entity;
  const {
    title,
    changed,
    fieldIntroText,
    fieldPageLastBuilt,
    fieldAlert,
    fieldDescription,
    moderationState: [{ value: published }],
    metatag: { value: metaTags },
  } = entity;
  // collapse title
  // Question: Can we always assume that title is an array of one item, with that item being an object with a `value` key?
  transformed.title = getDrupalValue(title);
  transformed.entityBundle = 'page';

  transformed.fieldIntroText = getDrupalValue(fieldIntroText);
  transformed.changed = new Date(getDrupalValue(changed)).getTime() / 1000;
  transformed.fieldPageLastBuilt = new Date(
    getDrupalValue(fieldPageLastBuilt),
  ).toUTCString();

  transformed.entityPublished = published === 'published';
  delete transformed.moderationState;

  if (isEmpty(fieldDescription)) {
    transformed.fieldDescription = null;
  }

  if (isEmpty(flatten(fieldAlert))) {
    transformed.fieldAlert = { entity: null };
  }

  transformed.entityMetaTags = [
    createMetaTag('MetaValue', 'title', metaTags.title),
    createMetaTag('MetaValue', 'twitter:card', metaTags.twitter_cards_type),
    createMetaTag('MetaProperty', 'og:site_name', metaTags.og_site_name),
    createMetaTag('MetaValue', 'twitter:title', metaTags.twitter_cards_title),
    createMetaTag('MetaValue', 'twitter:site', metaTags.twitter_cards_site),
    createMetaTag('MetaProperty', 'og:title', metaTags.og_title),
  ];
  delete transformed.metatag;

  return entity;
}

module.exports = pageTransform;
