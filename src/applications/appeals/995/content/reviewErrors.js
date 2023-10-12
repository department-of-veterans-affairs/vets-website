import { PRIMARY_PHONE } from '../constants';

import { profileReviewOverride } from '../pages/contactInformation';

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
        return { chapterKey: 'evidence', pageKey: 'evidenceSummary' };
      }
      if (err.includes(PRIMARY_PHONE)) {
        return {
          chapterKey: 'infoPages',
          pageKey: 'confirmContactInfo',
        };
      }
    }
    return profileReviewOverride(err);
  },
};

export default reviewErrors;
