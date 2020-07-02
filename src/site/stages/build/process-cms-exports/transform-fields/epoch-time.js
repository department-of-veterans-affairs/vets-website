const { utcToEpochTime } = require('../transformers/helpers');
const { transform: getDrupalValue } = require('./get-drupal-value');

const transform = fieldData => utcToEpochTime(getDrupalValue(fieldData));

// TODO: Figure out how to determine when this is applicable; I'm guessing with 'Date'
const applicableTypes = ['Date'];
const predicate = fieldSchema =>
  applicableTypes.includes(fieldSchema['Field type']);

module.exports = { predicate, transform };
