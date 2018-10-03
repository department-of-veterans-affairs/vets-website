import _ from 'lodash';

export default function objectKeysToCamelCase(obj) {
  return _.reduce(
    obj,
    (result, value, key) => {
      const finalValue =
        _.isPlainObject(value) || _.isArray(value)
          ? objectKeysToCamelCase(value)
          : value;
      return { ...result, [_.camelCase(key)]: finalValue };
    },
    {},
  );
}
