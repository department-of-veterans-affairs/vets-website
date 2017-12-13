const arrayIndexRE = /(.+)\[(\d+)\]$/;
const numOnlyRE = /^(\d+)$/;


/**
 * Takes a string and casts it into an array.
 * Can take strings like a.b[4].c
 *
 * @param {string} path
 * @return {Array}
 */
export default function deconstructPath(path) {
  const arrayPath = path.split('.');

  // Change ['a', 'b[0]'] -> ['a', 'b', 0]
  // and ['a', 'b', '0'] -> ['a', 'b', 0]
  const deconstruct = (e, i) => {
    // Skip the nubers we insert
    if (typeof e === 'number') {
      return;
    }

    const arrayIndexMatches = e.match(arrayIndexRE);
    const numOnlyMatches = e.match(numOnlyRE);
    if (arrayIndexMatches) {
      arrayPath[i] = arrayIndexMatches[1];
      arrayPath.splice(i + 1, 0, parseInt(arrayIndexMatches[2], 10));
    } else if (numOnlyMatches) {
      arrayPath[i] = parseInt(numOnlyMatches[1], 10);
    }
  };

  arrayPath.forEach(deconstruct);

  return arrayPath;
}
