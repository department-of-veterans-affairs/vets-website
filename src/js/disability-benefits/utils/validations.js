import { isNotBlank } from '../../common/utils/validations';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const FILE_TYPES = [
  'pdf',
  'gif',
  'tiff',
  'tif',
  'jpeg',
  'jpg',
  'bmp',
  'txt'
];

export function isValidFileSize(file) {
  return file.size < MAX_FILE_SIZE;
}

export function isValidFileType(file) {
  return FILE_TYPES.some(type => file.name.endsWith(type));
}

export function isValidFile(file) {
  return !!file && isValidFileSize(file) && isValidFileType(file);
}

export function isValidDocument({ file, docType }) {
  return isNotBlank(docType.value) && isValidFile(file);
}
