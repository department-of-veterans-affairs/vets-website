const numIndexRE = /(.+)\[(\d+)\]$/;

/**
 * Takes a string and casts it into an array.
 * Can take strings like a.b[4].c
 *
 * @param {string} path
 * @return {Array}
 */
export function deconstructPath(path) {
  const arrayPath = path.split('.');

  // Change ['a', 'b[0]'] -> ['a', 'b', 0]
  arrayPath.forEach((e, i) => {
    // Skip the nubers we insert
    if (typeof e === 'number') {
      return;
    }

    const matches = e.match(numIndexRE);
    if (matches) {
      arrayPath[i] = matches[1];
      arrayPath.splice(i + 1, 0, parseInt(matches[2], 10));
    }
  });

  return arrayPath;
}

/**
 * Gets a the value at the end of the path.
 *
 * @param {Object} object
 * @param {Array|string} path
 * @param {*} [defaultValue]
 * @return {*}
 */
// export function get(object, path, defaultValue) {
// }
