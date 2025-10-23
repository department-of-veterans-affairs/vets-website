/**
 * Find if an array of fixed length is nested within a variable-sized array
 * @param {Number[]|String[]} variableArray - array of variable size (file)
 * @param {Number[]|String[]} fixedArray - array of fixed size (signature)
 * @returns {Boolean}
 */
export default function arrayIncludesArray(variableArray, fixedArray) {
  if (
    !Array.isArray(variableArray) ||
    variableArray.length === 0 ||
    !Array.isArray(fixedArray) ||
    fixedArray.length === 0
  ) {
    return false;
  }

  // Skip expensive check if possible
  const startIndex = variableArray.indexOf(fixedArray[0]);

  return startIndex < 0
    ? false
    : variableArray.some((_, variableIndex) => {
        // docx sig isn't near the beginning of the file
        if (variableIndex < startIndex) {
          return false;
        }
        return fixedArray.every(
          (fixedElement, fixedIndex) =>
            fixedElement === variableArray[variableIndex + fixedIndex],
        );
      });
}
