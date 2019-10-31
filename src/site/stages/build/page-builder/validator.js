const { Validator } = require('jsonschema');

const {
  entityReference,
  entityReferenceArray,
} = require('./schemas/common/entity-reference');
const genericNestedString = require('./schemas/common/generic-nested-string');

// Set up formats
Validator.prototype.customFormats.uuid = input =>
  /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(input);

const v = new Validator();

// Add schema references
v.addSchema(entityReference, '/EntityReference');
v.addSchema(entityReferenceArray, '/EntityReferenceArray');
v.addSchema(genericNestedString, '/GenericNestedString');

module.exports = v;
