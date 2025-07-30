import { camelCase, lowerCase, upperFirst } from 'lodash';

export const toPascalCase = str => {
  return upperFirst(camelCase(str));
};

export const toSentenceCase = str => {
  return upperFirst(lowerCase(str));
};
