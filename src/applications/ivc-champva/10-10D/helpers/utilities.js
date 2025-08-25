import get from '@department-of-veterans-affairs/platform-forms-system/get';
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

// Extracting this to a function so there aren't a thousand identical
// ternaries we have to change later
export function sponsorWording(formData, isPosessive = true, cap = true) {
  const retVal = isPosessive ? 'sponsor’s' : 'sponsor';
  // Optionally capitalize first letter and return
  return cap ? retVal.charAt(0).toUpperCase() + retVal.slice(1) : retVal;
}

/**
 * Adds a new `applicant` object to the start of the `formData.applicants`
 * array. This is used to add the certifier info to the first applicant
 * slot so users don't have to enter info twice if the certifier is also an app.
 * @param {object} formData standard formData object
 * @param {object} name standard fullNameUI name to populate
 * @param {string} email email address to populate
 * @param {string} phone phone number to populate
 * @param {object} address standard addressUI address object to populate
 */
export function populateFirstApplicant(formData, name, email, phone, address) {
  const modifiedFormData = formData; // changes will affect original formData
  const newApplicant = {
    applicantName: name,
    applicantEmailAddress: email,
    applicantAddress: address,
    applicantPhone: phone,
  };
  if (modifiedFormData.applicants) {
    // Get index of existing applicant w/ same name OR phone+email
    const matchIndex = modifiedFormData.applicants.findIndex(
      a =>
        JSON.stringify(a.applicantName) === JSON.stringify(name) ||
        (a.applicantEmailAddress === email && a.applicantPhone === phone),
    );

    if (matchIndex === -1) {
      modifiedFormData.applicants = [
        newApplicant,
        ...modifiedFormData.applicants,
      ];
    } else if (matchIndex === 0) {
      // If match found at first spot in applicant array, override:
      modifiedFormData.applicants[matchIndex] = {
        ...modifiedFormData.applicants[matchIndex],
        ...newApplicant,
      };
    }
  } else {
    // No applicants yet. Create array and add ours:
    modifiedFormData.applicants = [newApplicant];
  }
  return modifiedFormData;
}

// Only show address dropdown if we're not the certifier
// AND there's another address present to choose from:
export function page15aDepends(formData, index) {
  const certifierIsApp = get('certifierRole', formData) === 'applicant';
  const certAddress = get('street', formData?.certifierAddress);

  return (
    (index && index > 0) || (certAddress && !(certifierIsApp && index === 0))
  );
}

// Compare two objects (with the same keys) and identify differences
export function objDiff(obj1, obj2, ignoreViewOnlyProps = true) {
  return Object.keys(obj1).filter(
    k =>
      (obj1[k] && obj2[k]) !== undefined &&
      obj1[k] !== obj2[k] &&
      !(ignoreViewOnlyProps && k.includes('view:')),
  );
}
