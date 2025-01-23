const saveInProgress = (returnUrl = '/informal-conference') => ({
  formData: {
    veteran: {
      ssnLastFour: '7821',
      vaFileLastFour: '8765',
    },
    zipCode5: '94608',
    sameOffice: true,
    privacyAgreementAccepted: true,
    informalConference: 'rep',
    informalConferenceRep: {
      name: 'James P. Sullivan',
      phone: '8005551212',
    },
    informalConferenceTimes: {
      time1: 'time0800to1000',
      time2: 'time1000to1230',
    },
    contestedIssues: [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'Headaches',
          description: 'Acute chronic head pain',
          ratingIssuePercentNumber: '20',
          approxDecisionDate: '2021-06-10',
          decisionIssueId: 44,
          ratingIssueReferenceId: '66',
          ratingDecisionReferenceId: null,
        },
        'view:selected': true,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'Being green',
          description: 'Chronic greenness',
          ratingIssuePercentNumber: '50',
          approxDecisionDate: '2021-06-01',
          decisionIssueId: 42,
          ratingIssueReferenceId: '52',
          ratingDecisionReferenceId: '999',
        },
        'view:selected': true,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'Monocular vision',
          ratingIssuePercentNumber: '5',
          approxDecisionDate: '2021-06-04',
          decisionIssueId: 1,
          ratingIssueReferenceId: '2',
          ratingDecisionReferenceId: '',
        },
      },
    ],
  },
  metadata: {
    version: 1,
    returnUrl,
    savedAt: 1628019161803,
    submission: {
      status: false,
      errorMessage: false,
      id: false,
      timestamp: false,
      hasAttemptedSubmit: false,
    },
    expiresAt: 7226582400,
    lastUpdated: 1628019162,
    inProgressFormId: 3,
  },
});

export default saveInProgress;
