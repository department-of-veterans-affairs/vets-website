const assert = require('assert');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');

const {
  getContentModelType,
  getAllImportsFrom,
  readEntity,
} = require('./helpers');
const { fieldTransformers, serialize } = require('./field-transformers');

const transformers = getAllImportsFrom(
  path.resolve(__dirname, 'field-transformers'),
);

const inputSchemas = getAllImportsFrom(path.resolve(__dirname, 'schemas/raw'));

const outputSchemas = getAllImportsFrom(
  path.resolve(__dirname, 'schemas/transformed'),
);

// These will change if we can replace the manual JSON schema creation process
const getInputSchema = entity => inputSchemas[getContentModelType(entity)];
const getOutputSchema = (entity, outputSchemaFromParent) => {
  const schema =
    outputSchemaFromParent || outputSchemas[getContentModelType(entity)];

  // The data may match multiple schemas; find the right one
  const schemaOptions = schema.anyOf || schema.oneOf;
  if (schemaOptions) {
    // This should only happen when an entity's field is an entity reference
    // which may be multiple types of entities. For example, a node-page's
    // fieldFeaturedContent which may be any type of paragraph. If this is the
    // case, use the contentModelType on the entity to find the schema option.
    // Each schema option must have a title matching its content model type.
    const match = schemaOptions.find(
      option => option.$contentModelType === getContentModelType(entity),
    );
    if (!match) {
      /* eslint-disable no-console */
      console.error(
        chalk.red(
          `No match found for ${getContentModelType(
            entity,
          )} in the possible schemas.`,
        ),
      );
      console.error(chalk.yellow('Data:'), entity);
      console.error(chalk.yellow('Schema:'), schema);
      /* eslint-enable no-console */
      throw new Error(
        `No match found for ${getContentModelType(
          entity,
        )} in the possible schemas.`,
      );
    }
    return match;
  }
  return schema;
};

// An alternative to this approach would be to map the output field to the input
// field in the output schema with a $comment or something
const inputKeyExceptions = new Map([
  // ['entityPublished', 'status'], // We don't need to map it to the status key since we're passing the entire entity to this function
  ['entityUrl', 'path'],
  // This may not work; if I recall, this is sometimes metatags with an s in the CMS output
  ['entityMetatags', 'metatag'],
  // Temporary workaround to account for the extra underscore
  ['fieldLocalHealthCareService', 'field_local_health_care_service_'],
]);

const getInputKey = outputKey =>
  inputKeyExceptions.get(outputKey) || _.snakeCase(outputKey);

/**
 * Identify whether the entity property is an entity reference.
 *
 * Assumes that if the first item in the array is an entity reference, they all
 * will be.
 * @param {Object} prop - The entity property to check
 * @returns {boolean} - True if the property is an entity reference
 */
const isEntityReferenceArray = prop =>
  Array.isArray(prop) && prop[0] && prop[0].target_type && prop[0].target_uuid;

/**
 * Expands an array of entity references.
 *
 * If the output schema for the field says it should be an array, this will
 * return an array. If the schema says it should be an object, it'll return an
 * object.
 * @param {object[]} args.entityReferences - The array of entity references to expand
 * @param {object} args.outputFieldSchema - The output schema for the field
 *                                          containing the entity references
 * @param {string} args.inputKey - The key for the field in the input
 * @param {string} args.outputKey - The key for the field in the output
 * @param {string} args.contentModelType - The content model type of the parent
 *                                         entity (not the children this
 *                                         function is expanding)
 * @return {object|array} - The expanded entity or entities (depending on the
 *                          output schema type)
 */
function expandEntityReferenceArray({
  entityReferences,
  outputFieldSchema,
  inputKey,
  outputKey,
  contentModelType,
}) {
  let result = entityReferences.map(ref => {
    const childEntity = readEntity(
      path.resolve(
        __dirname,
        '../../../../../.cache/localhost/cms-export-content',
      ),
      ref.target_type,
      ref.target_uuid,
    );

    // Disabling because we can rely on function hoisting here
    // eslint-disable-next-line no-use-before-define
    return transformFields(
      childEntity,
      outputFieldSchema.items || outputFieldSchema,
    );
  });

  if (result.length > 1 && outputFieldSchema.type !== 'array') {
    // eslint-disable-next-line no-console
    console.error(
      chalk.red(
        `Multiple entity references found at ${inputKey} on ${contentModelType}, but the output schema for ${outputKey} expects a single object.`,
      ),
    );
  } else if (outputFieldSchema.type === 'object') {
    result = result[0];
  }
  return result;
}

/**
 * Transform a single entity of type 'object'.
 * @param {object} entity - The entity to transform
 * @param {object} inputSchema - The schema of the input JSON file
 * @param {object} outputSchema - The schema of the output
 * @return {object}
 */
function transformObject(entity, inputSchema, outputSchema) {
  // TODO: Be more descriptive of the problem
  if (!outputSchema.properties) {
    throw new Error(
      `${chalk.yellow(
        "outputSchema is not of schema { type: 'object' }:",
      )} ${serialize(outputSchema)}`,
    );
  }

  // Iterate over each field:
  const transformedEntity = Object.entries(outputSchema.properties).reduce(
    /* eslint-disable no-param-reassign */
    /* eslint-disable no-console */
    (result, [outputKey, outputFieldSchema]) => {
      const inputKey = getInputKey(outputKey);

      // Sometimes the output schema nests fields in a new object. Check for
      // this in $expand. Assume if the property name is 'entity', it should
      // be expanded because all current uses of an 'entity' property are
      // child entities. This originates from the structure of the legacy
      // GraphQL query.
      if (outputFieldSchema.$expand || outputKey === 'entity') {
        // Disabling this rule because we can rely on function hoisting here
        // eslint-disable-next-line no-use-before-define
        result[outputKey] = transformFields(entity, outputFieldSchema);
        return result;
      }

      // Sometimes the output specifies fields added by the transformer.
      // This is for entityType, contentModelType, entityBundle, etc.
      if (!inputSchema.properties[inputKey]) {
        console.log(
          chalk.gray(
            `${getContentModelType(
              entity,
            )}: No input schema found for ${inputKey}. Skipping.`,
          ),
        );
        return result;
      }

      // If there is no data, make it null
      if (Array.isArray(entity[inputKey]) && !entity[inputKey].length) {
        result[outputKey] = null;
        return result;
      }

      // If the input schema is an entity reference, find the entity reference data and recurse
      if (isEntityReferenceArray(entity[inputKey])) {
        // eslint-disable-next-line no-console
        console.log(
          chalk.gray(`${getContentModelType(entity)}: Expanding ${outputKey}`),
        );
        result[outputKey] = expandEntityReferenceArray({
          entityReferences: entity[inputKey],
          outputFieldSchema,
          inputKey,
          outputKey,
          contentModelType: getContentModelType(entity),
        });
        return result;
      }

      // TODO: If the content model has a transformer hook for that field, use it

      // Find the input schema transformers
      const transformField = fieldTransformers.getTransformer(
        inputSchema.properties[inputKey],
        outputSchema.properties[outputKey],
      );

      if (!transformField) {
        result[outputKey] = entity[inputKey];
        return result;
      }

      // Return the transformed field
      result[outputKey] = transformField(entity[inputKey], entity);
      return result;
    },
    {},
    /* eslint-enable no-console */
    /* eslint-enable no-param-reassign */
  );

  // Add some properties to every entity
  transformedEntity.contentModelType = getContentModelType(entity); // So we can find the right output schema
  // NOTE: Assumes every bundle has a base type and machine name. This may not
  // always be true for media or files.
  const [entityType, entityBundle] = transformedEntity.contentModelType.split(
    '-',
  );
  transformedEntity.entityType = entityType;
  transformedEntity.entityBundle = entityBundle;

  return transformedEntity;
}

/**
 * @param {Object} entity - The raw entity
 * @param {Object} [outputSchemaFromParent] - The schema defining what the
 *                 output should look like. If undefined, this will use the
 *                 transformed schema for the content model type. This is meant
 *                 to be passed for a child entity from the parent's schema,
 *                 specifying only the fields the parent needs.
 */
function transformFields(entity, outputSchemaFromParent) {
  const inputSchema = getInputSchema(entity);
  if (!inputSchema) {
    throw new Error(
      `Could not find input schema for ${getContentModelType(entity)}`,
    );
  }

  const outputSchema = getOutputSchema(entity, outputSchemaFromParent);
  if (!outputSchema) {
    // eslint-disable-next-line no-console
    console.log(
      `Could not find output schema for ${getContentModelType(entity)}`,
    );
    return entity;
  }

  if (outputSchema.type === 'object') {
    return transformObject(entity, inputSchema, outputSchema);
  }

  if (outputSchema.type === 'array') {
    // This ternary is here because we sometimes need an array, but we only have
    // a single object.
    return (Array.isArray(entity) ? entity : [entity]).map(fieldData =>
      transformFields(fieldData, outputSchema.items),
    );
  }

  throw new Error(
    `Unexpected schema type in transformFields: ${outputSchema.type}`,
  );
}

module.exports = { serialize, transformFields };
