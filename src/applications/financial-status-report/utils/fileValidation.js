export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const FILE_TYPES = ['pdf', 'gif', 'jpeg', 'jpg', 'bmp', 'txt'];

export const isNotBlank = value => {
  return value !== '';
};

export const isValidFileSize = file => {
  return file.size < MAX_FILE_SIZE;
};

export const isEmptyFileSize = file => {
  return file.size === 0;
};

export const isValidFileType = file => {
  return FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type));
};

export const isValidFile = file => {
  return (
    !!file &&
    isValidFileSize(file) &&
    !isEmptyFileSize(file) &&
    isValidFileType(file)
  );
};

export const isValidDocument = ({ file, docType }) => {
  return isNotBlank(docType.value) && isValidFile(file);
};

export const setFocus = selector => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

export const isNullOrUndefinedOrEmpty = value => {
  return value === null || value === undefined || value === '';
};
