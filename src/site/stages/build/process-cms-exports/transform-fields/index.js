/* eslint-disable no-console */

const { camelCase } = require('lodash');
const { readEntity } = require('../helpers');
const { createMetaTagArray } = require('../transformers/helpers');
const fieldTransformer = require('./transformer');
const { transform: epochTime } = require('./epoch-time');

/**
 * Find the schema for the entity.
 * @param {object} entity - The entity as it's read from readEntity()
 * @param {object} schemas - The schema for the input JSON files
 * @returns {object} - The schema for the bundle
 * @throws {Error} - If the schema cannot be found for the entity
 */
function findBundleSchema(entity, schemas) {
  const result = schemas[entity.contentModelType];
  if (!result) {
    console.log('Available schemas:\n', Object.keys(schemas));
    throw new Error(`Could not find schema for ${entity.contentModelType}`);
  }
  return result;
}

/**
 * Get the field list for the bundle schema.
 *
 * This is a separate function to make refactoring later easier.
 * @param {object} bundleSchema - The schema for the bundle
 * @returns {object[]} - A list of field schemas
 */
function getFieldSchemas(bundleSchema) {
  return bundleSchema.fields;
}

/**
 * Get the data for the field.
 *
 * This is a separate function to make refactoring later easier.
 * @param {object} entity - The entity as it's read from readEntity()
 * @param {object} fieldSchema - The schema for the field
 * @returns {object[] | undefined} - The data for the field; an array of objects
 *                       because that's what all fields in the CMS export are.
 */
function getFieldData(entity, fieldSchema) {
  return entity[fieldSchema['Machine name']];
}

/**
 * Get the data for properties not specified in the input schema.
 * @param {object} entity - The entity as it's read from readEntity()
 * @returns {object} - The data for properties not specified in the input schema
 */
function getExtraProperties(entity) {
  // changed
  // entityId
  // entityMetatags / entityMetaTags (one is more popular)
  // entityPublished
  // entityUrl
  // title
  const props = {
    // Add other properties that should be on all entities here
    entityBundle: entity.contentModelType.split('-')[1],
    entityPublished: entity.status[0].value,
  };
  if (entity.changed) {
    props.changed = epochTime(entity.changed);
  }
  if (entity.title) {
    props.title = entity.title[0].value;
  }
  if (entity.nid) {
    props.entityId = entity.nid[0].value.toString();
  }
  if (entity.entityUrl) {
    props.entityUrl = entity.entityUrl;
  }
  if (entity.metatag) {
    // TODO: Some metatags have a different type name than the default __typename
    props.entityMetatags = createMetaTagArray(entity.metatag.value);
  }
  return props;
}

/**
 * Determine whether a field is an entity reference
 * @param {object[]} fieldData - The data in the field
 * @param {object} fieldSchema - The schema for the field
 * @return {boolean} - True of the field is an entity reference
 */
function isEntityReference(fieldData, fieldSchema) {
  return ['Entity reference', 'Entity reference revisions'].includes(
    fieldSchema['Field type'],
  );
}

/**
 * Expand the entity reference.
 *
 * TODO: Determine whether the result should be an array or an object.
 * @param {object[]} fieldData - The data in the field
 * @returns {object} - The expanded and transformed child entity
 */
function expandEntityReference(fieldData, schemas, contentDir) {
  return fieldData.map(fd => {
    const entity = readEntity(contentDir, fd.target_type, fd.target_uuid);
    // eslint-disable-next-line no-use-before-define
    return transformFields(entity, schemas, contentDir);
  });
}

/**
 * A map of input field name to output field name overrides.
 */
/* eslint-disable camelcase */
const fieldNameOverrides = {
  // Caution: Trouble ahead!
  // This is sometimes entityMetatags (lowercase t) in the GraphQL query / result
  // and sometimes entityMetaTags (capital T)
  field_meta_tags: 'entityMetatags',
};
/* eslint-enable camelcase */

/**
 * @param {object} entity - The entity as it's read from readEntity()
 * @param {object} schemas - The schema for the input JSON files
 * @param {string} contentDir - The path to the CMS export files; used for
 *                              reading in the entity reference files
 * @returns {object} - The transformed entity
 */
function transformFields(entity, schemas, contentDir) {
  const bundleSchema = findBundleSchema(entity, schemas);
  const fieldSchemas = getFieldSchemas(bundleSchema);

  return fieldSchemas.reduce((result, currentFieldSchema) => {
    const inputFieldName = currentFieldSchema['Machine name'];
    // console.log('------------------------');
    // console.log(inputFieldName);

    const outputFieldName =
      fieldNameOverrides[inputFieldName] || camelCase(inputFieldName);

    const fieldData = getFieldData(entity, currentFieldSchema);

    // !fieldData happens when the schema contains fields that aren't in the data
    // !fieldData.length happens with the field is empty in Drupal
    if (!fieldData || !fieldData.length) {
      return result;
    }

    // For each field, either expand the entity reference, or transform the data
    const transformedData = isEntityReference(fieldData, currentFieldSchema)
      ? expandEntityReference(fieldData, schemas, contentDir)
      : fieldTransformer.transform(
          fieldData,
          currentFieldSchema,
          entity.contentModelType,
          inputFieldName,
        );
    return Object.assign({}, result, {
      [outputFieldName]: transformedData,
    });
  }, getExtraProperties(entity));
}

module.exports = transformFields;
