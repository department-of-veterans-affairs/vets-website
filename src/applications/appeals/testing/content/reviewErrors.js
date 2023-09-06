/**
 * Error messages on the review & submit page
 * See github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/docs/reviewErrors.md
 */
const reviewErrors = {
  _override: err => {
    if (typeof err === 'string' && err.startsWith('veteran')) {
      return {
        chapterKey: 'infoPages',
        pageKey: 'confirmContactInfo',
      };
    }
    return null;
  },
};

export default reviewErrors;
