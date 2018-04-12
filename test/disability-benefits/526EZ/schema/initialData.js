export default {
  // For testing purposes only
  disabilities: [
    {
      diagnosticText: 'PTSD',
      decisionCode: 'Filler text', // Should this be a string?
      // Is this supposed to be an array?
      specialIssues: {
        specialIssueCode: 'Filler text',
        specialIssueName: 'Filler text'
      },
      ratedDisabilityId: '12345',
      disabilityActionType: 'Filler text',
      ratingDecisionId: '67890',
      diagnosticCode: 'Filler text',
      // Presumably, this should be an array...
      secondaryDisabilities: [
        {
          diagnosticText: 'First secondary disability',
          disabilityActionType: 'Filler text'
        },
        {
          diagnosticText: 'Second secondary disability',
          disabilityActionType: 'Filler text'
        }
      ]
    },
    {
      diagnosticText: 'Second Disability',
      decisionCode: 'Filler text', // Should this be a string?
      // Is this supposed to be an array?
      specialIssues: {
        specialIssueCode: 'Filler text',
        specialIssueName: 'Filler text'
      },
      ratedDisabilityId: '54321',
      disabilityActionType: 'Filler text',
      ratingDecisionId: '09876',
      diagnosticCode: 'Filler text',
      // Presumably, this should be an array...
      secondaryDisabilities: [
        {
          diagnosticText: 'First secondary disability',
          disabilityActionType: 'Filler text'
        },
        {
          diagnosticText: 'Second secondary disability',
          disabilityActionType: 'Filler text'
        }
      ]
    }
  ]
};
