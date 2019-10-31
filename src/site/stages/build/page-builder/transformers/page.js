const { flatten, isEmpty } = require('lodash');
const { getDrupalValue } = require('./helpers');

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

  return entity;
}

module.exports = pageTransform;
