export const records = ({ emptyIssue = false } = {}) => ({
  locations: [
    {
      locationAndName: 'South Texas VA Facility',
      issues: emptyIssue ? [] : ['Hypertension'],
      treatmentDate: '2000-02',
      noDate: false,
    },
    {
      locationAndName: 'Midwest Alabama VA Facility',
      issues: ['Hypertension', 'Gluten Intolerance'],
      treatmentDate: '',
      noDate: true,
    },
  ],
  providerFacility: [
    {
      providerFacilityName: 'Provider One',
      providerFacilityAddress: {
        country: 'USA',
        street: '123 Main Street',
        street2: 'Street address 2',
        city: 'San Antonio',
        state: 'TX',
        postalCode: '78258',
      },
      issues: ['Hypertension', 'Right Knee Injury', 'Migraines'],
      treatmentDateRange: {
        from: '2015-05-06',
        to: '2015-05-08',
      },
    },
    {
      providerFacilityName: 'Provider Two',
      providerFacilityAddress: {
        country: 'USA',
        street: '456 Elm Street',
        street2: '',
        city: 'Tallahassee',
        state: 'FL',
        postalCode: '87582',
      },
      issues: ['Right Knee Injury', 'Migraines'],
      treatmentDateRange: {
        from: '2010-12-13',
        to: '2010-12-15',
      },
    },
    {
      providerFacilityName: 'Provider Three',
      providerFacilityAddress: {
        country: 'USA',
        street: '987 Oak Street',
        street2: '',
        city: 'Madison',
        state: 'AL',
        postalCode: '18375',
      },
      issues: ['Hypertension', 'Right Knee Injury'],
      treatmentDateRange: {
        from: '2018-03-13',
        to: '2020-05-26',
      },
    },
  ],
  additionalDocuments: [
    {
      name: 'private-medical-records.pdf',
      confirmationCode: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      attachmentId: 'L049',
      size: 20000,
      isEncrypted: false,
    },
    {
      name: 'x-rays.pdf',
      confirmationCode: 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
      attachmentId: 'L023',
      size: 30000,
      isEncrypted: false,
    },
  ],
});
