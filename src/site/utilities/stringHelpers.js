const camelCase = require('lodash/fp/camelCase');
// Query strings to search for
const queryParamToBeChanged = [
  'CROP_FREEFORM',
  '_1_1_SQUARE_MEDIUM_THUMBNAIL',
  'CROP_7_2',
  'CROP_3_2',
  'CROP_2_1',
  'FieldNodeFieldSupportServices',
];

// If string starts with a number prepend an underscore to it
function prependUnderscore(string) {
  const firstNumber = new RegExp('^\\d');
  if (firstNumber.test(string)) {
    return `_${string}`;
  }
  return string;
}

// Camelcase a string
function camelize(str) {
  return camelCase(str);
}

// Remove all underscores from body of string and then prepend an underscore if string starts with number
function updateQueryString(matchedString) {
  const findUnderscores = new RegExp('_', 'g');
  let updatedString;

  switch (matchedString) {
    case 'FieldNodeFieldSupportServices':
      updatedString = 'FieldNodeLandingPageFieldSupportServices';
      break;
    default:
      updatedString = prependUnderscore(
        matchedString.replace(findUnderscores, ''),
      );
  }
  return updatedString;
}

// If a url is relative (not fully-qualified), return the fully-qualified version.
function qualifyUrl(path) {
  const siteUrl = 'https://va.gov';
  if (path.indexOf('http') !== 0) {
    const pathWithSlash = path.charAt(0) === '/' ? path : `/${path}`;
    return siteUrl + pathWithSlash;
  }
  return path;
}

module.exports = {
  updateQueryString,
  queryParamToBeChanged,
  camelize,
  qualifyUrl,
};
