import { assign } from 'lodash';

export default function nonRequiredFullName(fullName) {
  return assign({}, fullName, {
    required: [],
  });
}
