const prefill = {
  formData: {
    veteranFullName: { first: 'Jack', middle: null, last: 'Sparrow' },
    gender: 'M',
    veteranDateOfBirth: '1984-10-28',
    veteranSocialSecurityNumber: '796378321',
    homePhone: '3059223333',
    email: 'vets.gov.user+36@gmail.com',
    'view:maritalStatus': { maritalStatus: 'MARRIED' },
    spouseFullName: { first: 'Michelle', last: 'Smith' },
    spouseDateOfBirth: '1993-08-03',
    spouseSocialSecurityNumber: '451906574',
    maritalStatus: 'Married',
    dateOfMarriage: '2020-10-15',
    cohabitedLastYear: true,
    'view:reportDependents': true,
    'view:skipDependentInfo': false,
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: true,
    medicarePartAEffectiveDate: '2009-01-02',
    medicareClaimNumber: '7AD5WC9MW60',
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-details',
  },
};

module.exports = {
  benefitType: 'compensation',
  contestedIssues: [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Headaches',
        description: 'Acute chronic head pain',
        ratingIssuePercentNumber: '20',
        approxDecisionDate: '2021-6-10',
        decisionIssueId: 44,
        ratingIssueReferenceId: '66',
        ratingDecisionReferenceId: null,
      },
      'view:selected': true,
    },
  ],
  prefill,
};
