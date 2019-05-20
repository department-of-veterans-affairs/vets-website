function prependUnderscore(string) {
  const firstNumber = new RegExp('^\\d');
  if (firstNumber.test(string)) {
    return `_${string}`;
  }
  return string;
}

function shiftUnderscores(matchedString) {
  const findUnderscores = new RegExp('_', 'g');
  return prependUnderscore(matchedString.replace(findUnderscores, ''));
}

module.exports = {
  prependUnderscore,
  shiftUnderscores,
};
