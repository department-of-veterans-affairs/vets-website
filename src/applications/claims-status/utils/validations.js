export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

export const MAX_PDF_SIZE_MB = 99;
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 ** 2; // binary based

export const FILE_TYPES = ['pdf', 'gif', 'jpeg', 'jpg', 'bmp', 'txt'];

export function isNotBlank(value) {
  return value !== '';
}

export function validateIfDirty(field, validator) {
  if (field.dirty) {
    return validator(field.value);
  }

  return true;
}

export const isPdf = file => file.name?.toLowerCase().endsWith('pdf') || false;

export function isValidFileSize(file) {
  const maxSize = isPdf(file) ? MAX_PDF_SIZE_BYTES : MAX_FILE_SIZE_BYTES;
  return file.size < maxSize;
}

export function isEmptyFileSize(file) {
  return file.size === 0;
}

export function isValidFileType(file) {
  return FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type));
}

export function isValidFile(file) {
  return (
    !!file &&
    isValidFileSize(file) &&
    !isEmptyFileSize(file) &&
    isValidFileType(file)
  );
}

export function isValidDocument({ file, docType }) {
  return isNotBlank(docType.value) && isValidFile(file);
}
