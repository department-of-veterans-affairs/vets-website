// Test data for HLR
// import { addXMonths } from '../../helpers';

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
    street: '1200 Park Ave',
    city: 'Emeryville',
    country: 'USA',
    state: 'CA',
    postalCode: '94608',
  },

  // Checkbox state
  // 'view:hasForwardingAddress': true,
  // forwardingAddress: {
  //   effectiveDates: {
  //     from: addXMonths(6),
  //     to: addXMonths(12),
  //   },
  //   street: '1600 Pennsylvania Ave',
  //   city: 'Washington',
  //   country: 'USA',
  //   state: 'DC',
  //   postalCode: '20500',
  // },

  // Rated disabilities modified from 526EZ all-claims
  // Leave 'view:selected' set to false for unit testing
  contestedIssues: [
    {
      name: 'Tinnitus',
      description: `Rinnging in the ears. More intese in right ear. Lorem
        ipsum dolor sit amet, consectetur adipiscing elit.`,
      ratedDisabilityId: '0',
      ratingDecisionId: '63655',
      diagnosticCode: 5238,
      ratingPercentage: 10,
      'view:selected': false,
    },
    {
      name: 'Headaches',
      description: 'Acute chronic head pain',
      ratedDisabilityId: '1',
      ratingDecisionId: '63655',
      diagnosticCode: 5238,
      ratingPercentage: 50,
      'view:selected': false,
    },
  ],

  sameOffice: false,
  informalConferenceChoice: null,
  contactRepresentativeChoice: null,
  representative: {
    fullName: 'Fred Flintstone',
    phone: '8005551212',
  },
  scheduleTimes: {},
};
