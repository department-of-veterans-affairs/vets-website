/**
 * Combines multiple, sequential path segments into one normalized path
 * with a single "/" character between the segments.
 * @param args Path arguments
 * @returns {String} Returns the combined, normalized path
 */
export const buildPath = (...args: string[]): string => {
  return args
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/[/]*$/g, '');
      } else {
        return part.trim().replace(/(^[/]*|[/]*$)/g, '');
      }
    })
    .filter((x) => x.length)
    .join('/');
};

/**
 * Returns the same normalized path as the buildPath function, but
 * the path will always start with a leading "/" character.
 * @param args Path arguments
 * @returns {String} Returns the combined, normalized path with a leading "/"
 */
export const buildRelativePath = (...args: string[]): string => {
  const path = buildPath(...args);

  return path.startsWith('/') ? path : `/${path}`;
};
