// TODO: Move this function here once we replace the content model transformers
// with these field transformers.
const { getDrupalValue } = require('../transformers/helpers');

const applicableTypes = [
  'Boolean',
  'Number (integer)',
  'Text (plain)',
  'Text (plain, long)',
  'List (text)', // A dropdown menu in Drupal
  'Telephone number',
];
const predicate = fieldSchema =>
  applicableTypes.includes(fieldSchema['Field type']);

module.exports = { predicate, transform: getDrupalValue };
