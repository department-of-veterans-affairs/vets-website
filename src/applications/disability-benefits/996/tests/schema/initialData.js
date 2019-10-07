// Mock data for HLR
// Modified from https://github.com/department-of-veterans-affairs/vets-api/blob/master/spec/fixtures/education_benefits_claims/0994/prefill.json
// Remove before production

export default {
  fullName: { first: 'MIKE', last: 'WAZOWSKI' },
  // full SSN isn't necessary
  last4SSN: '4321',
  // full va file number isn't necessary
  last4VAFile: '5432',
  gender: 'M',
  dateOfBirth: '1996-06-21',

  phoneEmailCard: {
    // phone number needed TWICE for phone & email widget to work...
    // shown as primary phone in non-edit mode
    primaryPhone: '5033333333',
    // shown in input while editing phone number
    // editing this value does NOT update the `primaryPhone`
    phone: '5022222222',
    emailAddress: 'mike.wazowski@gmail.com',
  },

  mailingAddress: {
    addressLine1: '1200 Park Ave',
    city: 'Emeryville',
    countryCodeIso3: 'USA',
    // effectiveEndDate: '2018-04-21T20:09:50Z',
    // effectiveStartDate: '2018-04-21T20:09:50Z',
    state: 'CA',
    zipCode: '94608',
  },
};
