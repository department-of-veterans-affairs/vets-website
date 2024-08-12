// Test data for HLR

export default {
  veteran: {
    ssnLastFour: '9876',
    vaFileLastFour: '8765',
  },

  // Leave 'view:selected' set to false for unit testing
  contestedIssues: [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Tinnitus',
        description: `Ringing in the ears. More intense in right ear. This is
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
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Back sprain',
        ratingIssuePercentNumber: 5,
        approxDecisionDate: '2020-11-15',
        decisionIssueId: 1,
        ratingIssueReferenceId: '2',
        ratingDecisionReferenceId: '',
      },
    },
  ],

  sameOffice: false,
  informalConference: 'rep',
  informalConferenceRep: {
    name: 'Fred Flintstone',
    phone: '8005551212',
  },
  informalConferenceTimes: {
    time1: 'time0800to1000',
  },
  benefitType: 'compensation',
};
