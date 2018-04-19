export default {
  // For testing purposes only
  servicePeriods: [
    {
      serviceBranch: 'Army',
      dateRange: {
        from: '1990-02-02',
        to: '2010-03-04'
      }
    }
  ],
  disabilities: [
    {
      name: 'PTSD',
      // Is this supposed to be an array?
      specialIssues: {
        specialIssueCode: 'Filler text',
        specialIssueName: 'Filler text'
      },
      ratedDisabilityId: '12345',
      disabilityActionType: 'Filler text',
      ratingDecisionId: '67890',
      diagnosticCode: 'Filler text',
      classificationCode: 'Filler Code',
      // Presumably, this should be an array...
      secondaryDisabilities: [
        {
          name: 'First secondary disability',
          disabilityActionType: 'Filler text'
        },
        {
          name: 'Second secondary disability',
          disabilityActionType: 'Filler text'
        }
      ]
    },
    {
      name: 'Second Disability',
      // Is this supposed to be an array?
      specialIssues: {
        specialIssueCode: 'Filler text',
        specialIssueName: 'Filler text'
      },
      ratedDisabilityId: '54321',
      disabilityActionType: 'Filler text',
      ratingDecisionId: '09876',
      diagnosticCode: 'Filler text',
      classificationCode: 'Filler Code',
      // Presumably, this should be an array...
      secondaryDisabilities: [
        {
          name: 'First secondary disability',
          disabilityActionType: 'Filler text'
        },
        {
          name: 'Second secondary disability',
          disabilityActionType: 'Filler text'
        }
      ]
    }
  ]
};
