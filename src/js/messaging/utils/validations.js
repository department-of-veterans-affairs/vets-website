export function validateNumAttachments(files, maxAttachments) {
  return files.length > maxAttachments;
}

export function validateFileSize(files, max) {
  return !!files.find((file) => { return file.size > max; });
}

export function validateTotalFileSize(files, max) {
  // Get sizes for each file.
  const sizes = files.map((f) => {
    return f.size;
  });

  const total = sizes.reduce((a, b) => {
    return a + b;
  });

  return total > max;
}
