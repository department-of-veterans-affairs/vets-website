import { camelCase, lowerCase, startCase, upperFirst } from 'lodash';

export const toPascalCase = str => {
  return startCase(camelCase(str)).replace(/ /g, '');
};

export const toSentenceCase = str => {
  return upperFirst(lowerCase(str));
};
