const { getWysiwygString } = require('../transformers/helpers');
const { transform: getDrupalValue } = require('./get-drupal-value');

const transform = fieldData => ({
  processed: getWysiwygString(getDrupalValue(fieldData)),
});

const applicableTypes = [
  'Text (formatted)',
  'Text (formatted, long)',
  'Markup',
];
const predicate = fieldSchema =>
  applicableTypes.includes(fieldSchema['Field type']);

module.exports = { predicate, transform };
