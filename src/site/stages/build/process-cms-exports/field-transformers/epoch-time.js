const { utcToEpochTime } = require('../transformers/helpers');
const { transformer: getDrupalValue } = require('./getDrupalValue');

const transformer = fieldData => utcToEpochTime(getDrupalValue(fieldData));

const schemaMap = [
  {
    input: { $ref: 'GenericNestedString' },
    output: [{ title: 'unix time', type: 'number' }],
  },
];

module.exports = { transformer, schemaMap };
