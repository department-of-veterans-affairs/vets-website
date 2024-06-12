// Link text for review & submit page errors
// key = "name" from `form.formErrors.errors`
// see src/platform/forms-system/docs/reviewErrors.md
export default {
  hasBeenAdjudicatedBankrupt:
    "Please select whether you've declared bankruptcy (select yes or no)",
  _override: error => {
    if (error === 'location') {
      return {
        chapterKey: 'locations',
        pageKey: 'summary', // summary page on review & submit
      };
    }
    if (error.includes('dates')) {
      return {
        chapterKey: 'locations',
        pageKey: 'summary-dates',
      };
    }
    // always return null for non-matches
    return null;
  },
};
