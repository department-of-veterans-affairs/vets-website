import { profileReviewErrorOverride } from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { errorMessages } from './areaOfDisagreement';

const isNumberString = /^\d+$/;
const profileOverride = profileReviewErrorOverride();

/**
 * Error messages on the review & submit page
 * See github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/docs/reviewErrors.md
 */
const reviewErrors = {
  // Using default chapter & page keys from config/form
  _override: (err, fullError = {}) => {
    // err is a string of the page index (maybe a bug in calculating pageKey for
    // CustomPages in an array?)
    if (
      typeof err === 'string' &&
      isNumberString.test(err) &&
      fullError.__errors?.includes(errorMessages.missingDisagreement)
    ) {
      return {
        chapterKey: 'conditions',
        // include page index to match fullPageKey in ReviewCollapsibleChapter
        pageKey: `areaOfDisagreementFollowUp${err}`,
      };
    }
    // overrides for contact info page
    return profileOverride(err);
  },
};

export default reviewErrors;
