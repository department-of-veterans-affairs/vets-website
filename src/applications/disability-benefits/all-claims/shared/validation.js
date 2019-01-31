import _ from 'lodash/fp';

export function errorSchemaIsValid(errorSchema) {
  if (errorSchema && errorSchema.__errors && errorSchema.__errors.length) {
    return false;
  }

  return _.values(_.omit('__errors', errorSchema)).every(errorSchemaIsValid);
}
