import isPlainObject from 'lodash/isPlainObject';
import camelCase from 'lodash/camelCase';
import reduce from 'lodash/reduce';
import isArray from 'lodash/isArray';

export default function objectKeysToCamelCase(obj) {
  return reduce(
    obj,
    (result, value, key) => {
      const finalValue =
        isPlainObject(value) || isArray(value)
          ? objectKeysToCamelCase(value)
          : value;
      return { ...result, [camelCase(key)]: finalValue };
    },
    {},
  );
}
