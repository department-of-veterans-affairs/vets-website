// If string starts with a number prepend an underscore to it
function prependUnderscore(string) {
  const firstNumber = new RegExp('^\\d');
  if (firstNumber.test(string)) {
    return `_${string}`;
  }
  return string;
}

// Remove all underscores from body of string and then prepend an underscore if string starts with number
function shiftUnderscores(matchedString) {
  const findUnderscores = new RegExp('_', 'g');
  return prependUnderscore(matchedString.replace(findUnderscores, ''));
}

module.exports = {
  prependUnderscore,
  shiftUnderscores,
};
