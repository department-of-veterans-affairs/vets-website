const fs = require('fs');
const assert = require('assert');
const { sortBy, unescape, pick, omit } = require('lodash');
const moment = require('moment-timezone');
const { readEntity } = require('../helpers');

/**
 * Takes a string with escaped unicode code points and replaces them
 * with the unicode characters. E.g. '\u2014' -> '—'
 *
 * @param {String} string
 * @return {String}
 */
function unescapeUnicode(string) {
  assert(
    typeof string === 'string',
    `Expected type String in unescapeUnicode, but found ${typeof string}: ${string}`,
  );
  return string.replace(/\\u(\d{2,4})/g, (wholeMatch, codePoint) =>
    String.fromCharCode(`0x${codePoint}`),
  );
}

/**
 * A very specific helper function that expects to receive an
 * array with one item which is an object with a single `value` property
 *
 */
function getDrupalValue(arr) {
  if (arr.length === 0) return null;
  if (arr.length === 1)
    return typeof arr[0].value === 'string'
      ? unescapeUnicode(arr[0].value)
      : arr[0].value;
  // eslint-disable-next-line no-console
  console.warn(`Unexpected argument: ${arr.toString()}`);
  return null;
}

/**
 * This is currently a dummy function, but we may
 * need it in the future to convert weird uris like
 * `entity:node/27` to something resembling a
 * relative url
 *
 * If the uri begins with "internal:" it will be stripped out.
 */
function uriToUrl(uri) {
  const internal = 'internal:';
  if (uri.startsWith(internal)) {
    return uri.substring(internal.length);
  }
  return uri;
}

module.exports = {
  getDrupalValue,
  unescapeUnicode,
  uriToUrl,

  /**
   * This function takes an object where the keys are integers
   * and returns the object as an array where each index corresponds
   * to the key of the original object. This exists because we encountered
   * an object that looked like `{"0": "foo", "1": "bar", "caption": "Hi!"}`
   *
   * @param {object}
   * @return {array}
   */
  combineItemsInIndexedObject(obj) {
    const values = [];
    for (const [key, value] of Object.entries(obj)) {
      if (Number.isInteger(Number.parseInt(key, 10))) {
        values.push([key, value]);
      }
    }
    return sortBy(values, [item => item[0]]).map(item => item[1]);
  },

  /**
   * Takes a string and applies the following:
   * - Transforms escaped unicode to characters
   *
   * @param {string}
   * @return {string}
   */
  getWysiwygString(value) {
    return unescape(value);
  },

  /**
   * Takes an array meant to contain only one object.
   * If this object exists, an object will be returned matching what is expected for "fieldLink" objects,
   * otherwise null is returned.
   *
   * If the optional parameter is used, the returned object will only contain those attributes.
   *
   * @param {array} fieldLink
   * @param {array} attrs
   * @return {object}
   */
  createLink(fieldLink, attrs = ['url', 'title', 'options']) {
    const { uri, title, options } = fieldLink[0] || {};

    return fieldLink[0]
      ? pick(
          {
            url: { path: uriToUrl(uri) },
            title,
            options,
          },
          attrs,
        )
      : null;
  },

  /**
   * Takes a timestamp like 2019-09-10T13:43:47+00:00
   * and returns the epoch time.
   */
  utcToEpochTime(timeString) {
    return moment.tz(timeString, 'UTC').unix();
  },

  createMetaTagArray(metaTags, typeName = '__typename') {
    function createMetaTag(type, key, value) {
      return {
        [typeName]: type,
        key,
        value,
      };
    }

    return [
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
      createMetaTag(
        'MetaProperty',
        'og:image:height',
        metaTags.og_image_height,
      ),
      createMetaTag('MetaValue', 'twitter:image', metaTags.twitter_cards_image),
      createMetaTag('MetaProperty', 'og:image', metaTags.og_image_0),
    ].filter(t => t.value);
  },

  /**
   * Takes an object schema and array of properties and returns a new schema
   * with only the properties we specify. If any of the `properties` are
   * required in the original `schema`, it'll remove them from the array. This
   * also removes the $id to avoid schema naming collisions in AJV.
   *
   * Additionally, it does some error checking to ensure that all the
   * `properties` exist in the schema. This ensures that if the upstream
   * `schema` is updated to remove a property that we specify in `properties`,
   * it'll throw an error so an engineer will be forced to update the schema
   * that uses this function. This will hopefully keep the schemas from getting
   * out-of-sync.
   *
   * NOTE: This should probably be in a schema helpers file.
   *
   * @param {Object} schema - A schema of type 'object'
   * @param {Array<String>} properties - A list of properties found in `schema`
   *                                     that we want to use
   * @return {Object} The new schema
   */
  usePartialSchema(schema, properties) {
    // Some sanity checking before we start
    assert(
      schema.type === 'object',
      `Expected object schema. Found ${schema.type}`,
    );
    assert(
      Array.isArray(properties),
      `Expected properties to be an array; typeof properties: ${typeof properties}`,
    );
    assert(
      properties.every(
        p => typeof p === 'string',
        `Expected all items in properties array to be strings. properties: ${properties.join(
          ', ',
        )}`,
      ),
    );

    // Check that all the properties are in the properties object
    // Checking for truthiness because all properties should be an object
    const missingProps = properties.filter(p => !schema.properties[p]);
    assert(
      !missingProps.length,
      `Cannot use properties that aren't in the schema: ${missingProps.join(
        ', ',
      )}`,
    );

    // Remove $id to avoid schema naming collisions in AJV
    const newSchema = omit(schema, '$id');
    newSchema.properties = pick(newSchema.properties, properties);

    // Remove them from the required array if it exists
    if (newSchema.required) {
      newSchema.required = newSchema.required.filter(p =>
        properties.includes(p),
      );
    }

    // Return the new schema
    return newSchema;
  },

  /**
   * Search for all entities matching the parameters and return the transformed
   * entities.
   *
   * @param {String} baseType - The base type of the entity
   * @param {String} contentDir - The path to the directory to read the files from
   * @param {Function} assembleEntityTree - The assembleEntityTree function which
   *                                        is passed to the transformer function
   * @param {String} subType - [Optional] The subType of the entity
   * @param {Function} filter - [Optional] A function which recieves the object
   *                              read from the JSON file and returns true if we
   *                              should keep the entity or false if we should not
   *
   * TODO: Memoize this function to improve speed if the build is slow because
   * of this CMS content transformation process.
   *
   * @return {Array<Object>} - The transformed entities whose raw form matches
   *                           the parameters
   */
  findMatchingEntities(
    baseType,
    contentDir,
    assembleEntityTree,
    { subType, filter } = {},
  ) {
    // Sanity checks
    assert(
      typeof baseType === 'string',
      `baseType needs to be a string. Found ${typeof baseType} (${baseType})`,
    );
    assert(
      fs.lstatSync(contentDir).isDirectory(),
      `${contentDir} is not a directory.`,
    );
    assert(
      typeof assembleEntityTree === 'function',
      'Please pass assembleEntityTree from the transformer.',
    );
    if (subType)
      assert(
        typeof subType === 'string',
        `subType needs to be a string. Found ${typeof subType} (${subType})`,
      );
    if (filter)
      assert(
        typeof filter === 'function',
        `filter needs to be a string. Found ${typeof filter} (${filter})`,
      );

    // Look through contentDir for all `${baseType}.*.json` files
    return (
      fs
        .readdirSync(contentDir)
        .filter(name => name.startsWith(`${baseType}.`))
        .map(name => {
          const uuid = name.split('.')[1];
          return readEntity(contentDir, baseType, uuid, { noLog: true });
        })
        .filter(
          // Filter them by `subType` if available
          // NOTE: Not all content models keep their subType in `.type[0]`
          // If we have to search for those content models, we'll need to update this
          entity => (subType ? entity.type[0].target_id === subType : true),
        )
        // Filter them by `filter` if available
        .filter(filter || (() => true))
        .map(entity => assembleEntityTree(entity))
    );
  },
};
