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

  if (Array.isArray(fieldDescription) && fieldDescription.length === 0) {
    transformed.fieldDescription = null;
  }

  if (
    Array.isArray(fieldAlert) &&
    fieldAlert.length === 1 &&
    fieldAlert[0].length === 0
  ) {
    transformed.fieldAlert = { entity: null };
  }

  return entity;
}

const transformers = {
  page: pageTransform,
};

// Recursively replaces all snake_case properties in an object
// with camelCased properties
function toCamel(obj) {
  let camelKey = null;
  return Object.entries(obj).reduce((newObj, [key, prop]) => {
    if (Array.isArray(prop)) {
      prop.forEach((item, index) => {
        if (!(Array.isArray(item) && item.length === 0))
          // eslint-disable-next-line no-param-reassign
          obj[key][index] = toCamel(item);
      });
    }

    if (key.includes('_')) {
      camelKey = key.replace(/([_][a-z])/gi, gap =>
        gap.toUpperCase().replace('_', ''),
      );
    } else {
      camelKey = key;
    }

    // eslint-disable-next-line no-param-reassign
    newObj[camelKey] = prop;
    return newObj;
  }, {});
}

/**
 * Takes the entity type and entity contents and returns a new
 * entity with modified data to fit the content model.
 *
 * @param {String} contentModelType - The type of content model.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with modified properties based on
 *                    the specific content model type.
 */
function transformEntity(entityType, entity) {
  // TODO: Perform transformations based on the content model type

  const entityTransformer = transformers[entityType];

  const transformed = toCamel(entity);

  return entityTransformer(transformed);
}

module.exports = {
  transformEntity,
};
