const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();

// Custom formats
ajv.addFormat('custom-date-time', /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

/**
 * Loads all the schemas in a directory into ajv
 */
const loadSchemas = dir => {
  fs.readdirSync(dir).forEach(fileName =>
    // eslint-disable-next-line import/no-dynamic-require
    ajv.addSchema(require(path.join(dir, fileName))),
  );
};

loadSchemas(path.join(__dirname, 'schemas', 'common'));
loadSchemas(path.join(__dirname, 'schemas', 'raw'));
loadSchemas(path.join(__dirname, 'schemas', 'transformed'));

module.exports = (entity, schema) => {
  const validate = ajv.compile(schema);
  const valid = validate(entity);
  // if (!valid) console.log(validate);
  return valid ? [] : validate.errors;
};
