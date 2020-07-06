const { createLink } = require('../transformers/helpers');

const applicableTypes = ['Link'];
const predicate = fieldSchema =>
  applicableTypes.includes(fieldSchema['Field type']);

module.exports = { predicate, transform: createLink };
