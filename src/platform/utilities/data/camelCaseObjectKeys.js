import _ from 'lodash';

export default function objectKeysToCamelCase(originalObject) {
  const camelCaseObject = {};
  _.forEach(
    originalObject,
    (value, key) => {
      let newValue;
      if (_.isPlainObject(value) || _.isArray(value)) {
        newValue = objectKeysToCamelCase(value);
      }
      camelCaseObject[_.camelCase(key)] = newValue;
    }
  );
  return camelCaseObject;
}
