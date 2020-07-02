const { combineItemsInIndexedObject } = require('../transformers/helpers');
const { transform: getDrupalValue } = require('./get-drupal-value');

const transform = fieldData => ({
  value: combineItemsInIndexedObject(getDrupalValue(fieldData)),
});

const applicableTypes = ['Table Field'];
const predicate = fieldSchema =>
  applicableTypes.includes(fieldSchema['Field type']);

module.exports = { predicate, transform };
