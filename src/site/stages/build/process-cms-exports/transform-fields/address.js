const { mapKeys, camelCase } = require('lodash');

const predicate = fieldSchema => fieldSchema['Field type'] === 'Address';

// The keys of the address are snake_case, but we want camelCase
const transform = fieldData => mapKeys(fieldData[0], (v, k) => camelCase(k));

module.exports = { predicate, transform };
