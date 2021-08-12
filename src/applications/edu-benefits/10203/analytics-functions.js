import recordEvent from 'platform/monitoring/record-event';

export default {
  currentlyUsedBenefits: formData => {
    const benefits = formData['view:benefit'];
    Object.keys(benefits)
      .filter(b => benefits[b] === true)
      .forEach(function(value) {
        recordEvent({
          event: 'edu-form-change',
          'edu-form-field':
            'Which benefit have you used or are you currently using?',
          'edu-form-value': value,
          'edu-form-action': 'clicked',
        });
      });
  },
  ineligibilityAlert: data => {
    const {
      isChapter33,
      isEnrolledStem,
      isPursuingTeachingCert,
      isPursuingClinicalTraining,
      benefitLeft,
    } = data;
    const enrolledStemAndTeaching =
      isEnrolledStem || isPursuingTeachingCert || isPursuingClinicalTraining;
    recordEvent({
      event: 'edu-stem-scholarship-ineligibility-alert',
      'edu-eligibility-criteria-post911-met': isChapter33,
      'edu-eligibility-criteria-stem-or-teaching-met': enrolledStemAndTeaching,
      'edu-eligibility-criteria-used-all-benefits-met':
        benefitLeft !== 'moreThanSixMonths',
      'edu-eligibility-criteria-months-remaining-for-use': benefitLeft,
    });
  },
  exitApplication: () => {
    recordEvent({
      event: 'cta-primary-button-click',
    });
  },
};
