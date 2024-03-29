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

// Turn camelCase into capitalized words ("camelCase" => "Camel Case")
export function makeHumanReadable(inputStr) {
  return inputStr
    .match(/^[a-z]+|[A-Z][a-z]*/g)
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');
}

// Helper to detect if we're on review page when we don't have access
// to form context. Necessary because list and loop pages don't seem
// to respect 'hideOnReview' or 'keepInPageOnReview'
export function onReviewPage() {
  return window.location.href.includes('review-and-submit');
}

// Used to condense some repetitive schema boilerplate in form config
export const MAX_APPLICANTS = 3;
export const applicantListSchema = (requireds, propertyList) => {
  return {
    type: 'object',
    properties: {
      applicants: {
        type: 'array',
        minItems: 1,
        maxItems: MAX_APPLICANTS,
        items: {
          type: 'object',
          required: requireds,
          properties: propertyList,
        },
      },
    },
  };
};
