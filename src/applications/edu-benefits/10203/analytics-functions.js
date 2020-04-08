import recordEvent from 'platform/monitoring/record-event';

export default {
  ineligibilityStillApply: isStillApplying => {
    recordEvent({
      event: 'edu-form-change',
      'edu-form-field': 'ineligibility-still-apply-radio-button',
      'edu-form-value': isStillApplying ? 'Yes' : 'No',
    });
  },
  exploreOtherBenefits: () => {
    recordEvent({
      event: 'edu-navigation',
      'edu-action': 'explore-other-benefits',
    });
  },
  checkRemainingBenefits: () => {
    recordEvent({
      event: 'edu-navigation',
      'edu-action': 'check-remaining-benefits', // or 'stem-scholarship',
    });
  },
  navigateStemScholarship: () => {
    recordEvent({
      event: 'edu-navigation',
      'edu-action': 'stem-scholarship',
    });
  },
  seeApprovedStemPrograms: () => {
    recordEvent({
      event: 'edu-navigation',
      'edu-action': 'see-approved-stem-programs',
    });
  },
};
