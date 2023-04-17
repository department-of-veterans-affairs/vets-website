/**
 * Error messages on the review & submit page
 * See github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/docs/reviewErrors.md
 */
const reviewErrors = {
  _override: err => {
    if (
      typeof err === 'string' &&
      (err?.startsWith('locations[') || err?.startsWith('providerFacility['))
    ) {
      return { chapterKey: 'evidence', pageKey: 'evidenceSummary' };
    }
    return null;
  },
};

export default reviewErrors;
