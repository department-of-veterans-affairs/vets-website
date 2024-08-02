import { MAX_APPLICANTS } from '../config/constants';

export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${(num / 1000).toFixed(1)} KB`;
  }
  return `${num} B`;
};

export function isInRange(val, lower, upper) {
  return val >= lower && val <= upper;
}

// Helper to detect if we're on review page when we don't have access
// to form context. Necessary because list and loop pages don't seem
// to respect 'hideOnReview' or 'keepInPageOnReview'
export function onReviewPage() {
  return window.location.href.includes('review-and-submit');
}

// Used to condense some repetitive schema boilerplate in form config
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

/**
 * Gets the appropriate form key needed in the signature box so we can
 * corroborate who is signing the form.
 *
 * @param {object} formData All data currently in the form
 * @returns
 */
export function getNameKeyForSignature(formData) {
  let nameKey;
  if (formData.certifierRole === 'sponsor') {
    nameKey = 'veteransFullName';
  } else if (formData.certifierRole === 'applicant') {
    nameKey = 'applicants[0].applicantName';
  } else {
    nameKey = 'certifierName';
  }

  return nameKey;
}
