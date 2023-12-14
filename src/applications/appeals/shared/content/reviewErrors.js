import { profileReviewErrorOverride } from 'platform/forms-system/src/js/definitions/profileContactInfo';

/**
 * Error messages on the review & submit page
 * See github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/docs/reviewErrors.md
 */
const reviewErrors = {
  // using default chapter & page keys from config/form
  _override: profileReviewErrorOverride(),
};

export default reviewErrors;
