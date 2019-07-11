import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports

export default function nonRequiredFullName(fullName) {
  return _.assign({}, fullName, {
    required: [],
  });
}
