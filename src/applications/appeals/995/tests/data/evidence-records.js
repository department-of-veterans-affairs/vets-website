const providerFacilityAddress = {
  country: 'USA',
  street: '123 main',
  city: 'city',
  state: 'AK',
  postalCode: '90210',
};

export const records = ({ emptyIssue = false } = {}) => ({
  locations: [
    {
      locationAndName: 'VAMC Location 1',
      issues: emptyIssue ? [] : ['Test 1'],
      treatmentDate: '2011-01',
      noDate: false,
    },
    {
      locationAndName: 'VAMC Location 2',
      issues: ['Test 1', 'Test 2'],
      treatmentDate: '',
      noDate: true,
    },
  ],
  providerFacility: [
    {
      providerFacilityName: 'Private Doctor',
      providerFacilityAddress,
      issues: emptyIssue ? [] : ['Test 1', 'Test 2'],
      treatmentDateRange: { from: '2022-04-01', to: '2022-07-01' },
    },
    {
      providerFacilityName: 'Private Hospital',
      providerFacilityAddress,
      issues: ['Test 1', 'Test 2', 'Tinnitus'],
      treatmentDateRange: { from: '2022-09-20', to: '2022-09-30' },
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
