/**
 * Replaces double-quotes with single.
 * Replaces non-escaping backslashes with forward-slashes.
 *
 * @param {string} string
 * @returns {string}
 */
export const replaceEscapedCharacters = string => {
  return string
    .replaceAll('"', "'")
    .replace(/(?:\r\n|\n\n|\r|\n)/g, '; ')
    .replace(/(?:\t|\f|\b)/g, '')
    .replace(/\\(?!(f|n|r|t|[u,U][\d,a-fA-F]{4}))/gm, '/');
};
