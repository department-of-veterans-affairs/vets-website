const { flatten, isEmpty } = require('lodash');

/**
 * A very specific helper function that expects to receive an
 * array with one item which is an object with a single `value` property
 *
 */
function arrayCollapse(arr) {
  return arr.reduce((value, item) => {
    // eslint-disable-next-line no-param-reassign
    value = item.value;
    return value;
  }, null);
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
  } = entity;
  // collapse title
  // Question: Can we always assume that title is an array of one item, with that item being an object with a `value` key?
  transformed.title = arrayCollapse(title);
  transformed.entityBundle = 'page';

  transformed.fieldIntroText = arrayCollapse(fieldIntroText);
  transformed.changed = new Date(arrayCollapse(changed)).getTime() / 1000;
  transformed.fieldPageLastBuilt = new Date(
    arrayCollapse(fieldPageLastBuilt),
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
