export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${(num / 1000).toFixed(1)} KB`;
  }
  return `${num} B`;
};

// Expects a date as a string in YYYY-MM-DD format
export function getAgeInYears(date) {
  const difference = Date.now() - Date.parse(date);
  return Math.abs(new Date(difference).getUTCFullYear() - 1970);
}

export function isInRange(val, lower, upper) {
  return val >= lower && val <= upper;
}

// Clean up the medicare parts string stored on an applicant and drop ", Part D"
export function getParts(inputStr) {
  // de-camelcase the input text: "partA, partB" => "Part A, Part B"
  const deCamelcasedStr = inputStr.replace(
    /(\b[a-z])|([A-Z])/g,
    (match, group1, group2) => {
      return group1 ? group1.toUpperCase() : ` ${group2}`;
    },
  );

  // Remove the literal string ", Part D" and return
  return deCamelcasedStr.replace(/\b, Part\s*D\b/g, '');
}

// Turn camelCase into capitalized words ("camelCase" => "Camel Case")
export function makeHumanReadable(inputStr) {
  return inputStr
    .match(/^[a-z]+|[A-Z][a-z]*/g)
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');
}
