import { profileReviewErrorOverride } from 'platform/forms-system/src/js/definitions/profileContactInfo';

import { PRIMARY_PHONE } from '../constants';

const profileOverride = profileReviewErrorOverride();

/**
 * Error messages on the review & submit page
 * See github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/docs/reviewErrors.md
 */
const reviewErrors = {
  _override: err => {
    if (typeof err === 'string') {
      if (
        err?.startsWith('locations[') ||
        err?.startsWith('providerFacility[')
      ) {
        return { chapterKey: 'evidence', pageKey: 'summary' };
      }
      if (err.includes(PRIMARY_PHONE)) {
        return {
          chapterKey: 'infoPages',
          pageKey: 'choosePrimaryPhone',
        };
      }
    }
    return profileOverride(err);
  },
};

export default reviewErrors;
