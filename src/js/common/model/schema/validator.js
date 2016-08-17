const ajv = require('ajv');

module.exports = ajv({ allErrors: true, errorDataPath: 'property', removeAdditional: true, useDefaults: true });
