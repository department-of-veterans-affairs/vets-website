const { entityIsPublished } = require('../helpers');
const { transformer: getDrupalValue } = require('./getDrupalValue');

const transformer = (fieldData, entity) => entityIsPublished(entity);

const schemaMap = [
  {
    input: { $ref: 'GenericNestedString' },
    output: [{ title: 'published-state', type: 'boolean' }],
  },
];

module.exports = { transformer, schemaMap };
