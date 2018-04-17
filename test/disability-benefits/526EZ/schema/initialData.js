export default {
  // For testing purposes only
  disabilities: [
    {
      disability: { // Is this extra nesting necessary?
        diagnosticCode: '123',
        diagnosticText: 'Post-Traumatic Stress Disorder. (Also claimed as Insomnia)',
        ratingPercentage: 30,
        decisionCode: 'Filler text', // Should this be a string?
        // Is this supposed to be an array?
        specialIssues: {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        },
        ratedDisabilityId: '12345',
        disabilityActionType: 'Filler text',
        ratingDecisionId: '67890',
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
    },
    {
      disability: { // Is this extra nesting necessary?
        diagnosticCode: '1234',
        diagnosticText: 'Intervertebral Disc Degeneration and Osteoarthritisstatus post-anterior disc fusion L4-S1 and L5-S1 microdiscectomy. (Also claimed as muscle spasms back, herniated disc L4-L5 L5-S1)',
        ratingPercentage: 20,
        decisionCode: 'Filler text', // Should this be a string?
        // Is this supposed to be an array?
        specialIssues: {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        },
        ratedDisabilityId: '54321',
        disabilityActionType: 'Filler text',
        ratingDecisionId: '09876',
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
    }
  ]
};
