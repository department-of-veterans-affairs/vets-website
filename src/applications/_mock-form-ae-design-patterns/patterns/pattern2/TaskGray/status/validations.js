import { FILE_TYPES } from './constants';

export const isValidFileType = file =>
  FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type));
