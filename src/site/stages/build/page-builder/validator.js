const Ajv = require('ajv');

const ajv = new Ajv();

const {
  entityReference,
  entityReferenceArray,
} = require('./schemas/common/entity-reference');
const genericNestedString = require('./schemas/common/generic-nested-string');

// Custom formats
ajv.addFormat('custom-date-time', /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

// Common $ref schemas
ajv.addSchema(entityReference, 'EntityReference');
ajv.addSchema(entityReferenceArray, 'EntityReferenceArray');
ajv.addSchema(genericNestedString, 'GenericNestedString');

module.exports = (entity, schema) => {
  const validate = ajv.compile(schema);
  const valid = validate(entity);
  // if (!valid) console.log(validate);
  return valid ? [] : validate.errors;
};
