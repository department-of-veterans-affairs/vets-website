const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const FILE_TYPES = ['pdf', 'gif', 'jpeg', 'jpg', 'bmp', 'txt'];

export function isNotBlank(value) {
  return value !== '';
}

export function isValidFileSize(file) {
  return file.size < MAX_FILE_SIZE;
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

export function setFocus(selector) {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
}
