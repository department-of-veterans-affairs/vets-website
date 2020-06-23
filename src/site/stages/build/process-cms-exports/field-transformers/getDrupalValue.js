// TODO: Move this function here once we replace the content model transformers
// with these field transformers.
const { getDrupalValue } = require('../transformers/helpers');

const schemaMap = [
  {
    input: { $ref: 'GenericNestedString' },
    output: [{ type: 'string' }],
  },
];

module.exports = { transformer: getDrupalValue, schemaMap };
