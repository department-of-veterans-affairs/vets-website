import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { MAX_APPLICANTS } from '../config/constants';

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

// Only show address dropdown if we're not the certifier
// AND there's another address present to choose from:
export function page15aDepends(formData, index) {
  const certifierIsApp = get('certifierRole', formData) === 'applicant';
  const certAddress = get('street', formData?.certifierAddress);

  return (
    (index && index > 0) || (certAddress && !(certifierIsApp && index === 0))
  );
}
