import { FILE_TYPES } from './constants';

export const isNotBlank = value => {
  return value !== '';
};

export const isValidFileType = file =>
  FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type));

export const validateIfDirty = (field, validator) => {
  if (field.dirty) {
    return validator(field.value);
  }
  return true;
};
