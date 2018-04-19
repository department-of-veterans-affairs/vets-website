export default {
  // For testing purposes only
  disabilities: [
    {
      diagnosticCode: '123',
      name: 'Post-Traumatic Stress Disorder. (This could also be claimed as Insomnia.)',
      ratingPercentage: 30,
      // Is this supposed to be an array?
      specialIssues: [
        {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        }
      ],
      ratedDisabilityId: '12345',
      disabilityActionType: 'Filler text',
      ratingDecisionId: '67890',
      classificationCode: 'Filler Code',
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
      diagnosticCode: '1234',
      name: 'Intervertebral Disc Degeneration and Osteoarthritisstatus post-anterior disc fusion L4-S1 and L5-S1 microdiscectomy. (Also claimed as muscle spasms back, herniated disc L4-L5, L5-S1.)',
      ratingPercentage: 20,
      // Is this supposed to be an array?
      specialIssues: [
        {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        }
      ],
      ratedDisabilityId: '54321',
      disabilityActionType: 'Filler text',
      ratingDecisionId: '09876',
      classificationCode: 'Filler Code',
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
