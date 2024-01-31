export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${Math.floor(num / 1000)} KB`;
  }
  return `${num} B`;
};
