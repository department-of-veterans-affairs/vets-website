function pageTransform(entity) {
  const transformed = entity;
  // collapse title
  // Question: Can we always assume that title is an array of one item, with that item being an object with a `value` key?
  transformed.title = transformed.title[0].value;

  transformed.fieldIntroText = transformed.fieldIntroText[0].value;
  transformed.changed = new Date(transformed.changed[0].value).getTime() / 1000;
  transformed.fieldPageLastBuilt = new Date(
    transformed.fieldPageLastBuilt[0].value,
  ).toUTCString();

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
