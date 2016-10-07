export function validateNumAttachments(files, maxAttachments) {
  return files.length > maxAttachments;
}

export function validateFileSize(files, max) {
  return !!files.find((file) => { return file.size > max; });
}

export function validateTotalFileSize(files, max) {
  const total = files.reduce((sum, file) => {
    return sum + file.size;
  }, 0);

  return total > max;
}
