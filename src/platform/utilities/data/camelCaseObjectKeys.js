import { camelCase, isPlainObject, isArray, reduce } from 'lodash-es';

export default function objectKeysToCamelCase(obj) {
  return reduce(obj, (result, value, key) => {
    const finalValue = isPlainObject(value) || isArray(value) ? objectKeysToCamelCase(value) : value;
    return { ...result, [camelCase(key)]: finalValue };
  }, {});
}
