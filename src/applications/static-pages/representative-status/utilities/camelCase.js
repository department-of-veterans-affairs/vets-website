import { camelCase } from 'lodash';

export function convertKeysToCamelCase(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }

  const newObj = {};
  Object.keys(obj).forEach(key => {
    const camelCaseKey = camelCase(key);
    newObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
  });
  return newObj;
}
