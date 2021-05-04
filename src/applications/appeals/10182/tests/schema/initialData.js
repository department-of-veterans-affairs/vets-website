export default {
  veteran: {
    ssnLastFour: '9876',
    vaFileLastFour: '8765',
    // email, address & phone from profile data
  },
  homeless: false,
  'view:hasRep': true,
  representativeName: 'George Jetson',
  boardReviewOption: '',
  hearingTypePreference: '',
  socOptIn: true,
  'view:additionalEvidence': '',

  // Leave 'view:selected' set to false for unit testing
  contestableIssues: [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Tinnitus',
        description: `Rinnging in the ears. More intense in right ear. This is
          more text so the description goes into the second line.`,
        ratingIssuePercentNumber: 10,
        approxDecisionDate: '2020-11-01',
        decisionIssueId: 42,
        ratingIssueReferenceId: '52',
        ratingDecisionReferenceId: '',
      },
      'view:selected': false,
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Headaches',
        description: 'Acute chronic head pain',
        ratingIssuePercentNumber: 50,
        approxDecisionDate: '2020-11-10',
        decisionIssueId: 44,
        ratingIssueReferenceId: '66',
        ratingDecisionReferenceId: '',
      },
      'view:selected': false,
    },
  ],
  additionalIssues: [
    {
      issue: 'Back sprain',
      decisionDate: '2020-11-15',
      'view:selected': false,
    },
    {
      issue: 'Ankle sprain',
      decisionDate: '2020-11-16',
      'view:selected': false,
    },
  ],
  evidence: [
    {
      name: 'file.pdf',
      confirmationCode: 'UUID',
    },
  ],
};
