const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v\.?|vs\.?|via)$/i;
const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
const wordSeparators = /([ :–—-])/;

/**
 * Converts a string to title case.
 * Adapted from https://github.com/gouch/to-title-case
 *
 * @param {string} string
 * @return {string}
 */
module.exports = function titleCase(string) {
  return string
    .split(wordSeparators)
    .map((current, index, array) => {
      const shouldMakeLowerCase =
        /* Check for small words. */
        current.search(smallWords) > -1 &&
        /* Skip first and last word. */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore small words that start a hyphenated phrase. */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'));

      if (shouldMakeLowerCase) return current.toLowerCase();

      /* Ignore intentional capitalization. */
      if (current.substr(1).search(/[A-Z]|\../) > -1) return current;

      /* Capitalize the first letter. */
      return current.replace(alphanumericPattern, match => match.toUpperCase());
    })
    .join('');
};
