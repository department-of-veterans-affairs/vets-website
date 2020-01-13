// Test data for HLR
import { addXMonths } from '../../helpers';

export default {
  // Opt out of old appeals checkbox
  legacyOptInApproved: false,

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
    country: 'USA',
    state: 'CA',
    zipCode: '94608',
  },

  // Checkbox state
  'view:hasForwardingAddress': true,
  forwardingAddress: {
    effectiveDates: {
      from: addXMonths(6),
      to: addXMonths(12),
    },
    addressLine1: '1600 Pennsylvania Ave',
    city: 'Washington',
    country: 'USA',
    state: 'DC',
    zipCode: '20500',
  },

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
      useSameOffice: true,
      additionalNote: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam finibus pulvinar erat, ac luctus felis porttitor eget. Aenean luctus urna libero, tincidunt mollis ante cursus sed. Fusce a vehicula est, eget dignissim purus. Vestibulum quis placerat sapien. Vestibulum gravida libero quis lectus auctor, ut vehicula turpis maximus. Donec ultrices eu orci tincidunt elementum. Phasellus eros eros ornare.`,
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

  informalConferenceChoice: null,
  contactRepresentativeChoice: null,
  representative: {
    fullName: 'Fred Flintstone',
    phone: '8005551212',
  },
  scheduleTimes: {},
};

// ***************************
// *** format from vets360 ***
// ***************************
// loa3User: {
//   login: {
//     currentlyLoggedIn: true,
//   },
//   profile: {
//     accountType: 3,
//     dob: '1996-06-21',
//     email: 'mike.wazowski@gmail.com',
//     gender: 'M',
//     services: [],
//     status: 'OK',
//     userFullName: {
//       first: 'MIKE',
//       last: '',
//       middle: 'WAZOWSKI',
//       suffix: null,
//     },
//     verified: true,
//   },
// },
// homePhone: {
//   areaCode: '503',
//   countryCode: '1',
//   createdAt: '2019-04-21T20:09:50Z',
//   effectiveEndDate: '2019-04-21T20:09:50Z',
//   effectiveStartDate: '2019-04-21T20:09:50Z',
//   extension: '0000',
//   id: 123,
//   isInternational: false,
//   isTextable: false,
//   isTextPermitted: false,
//   isTty: true,
//   isVoicemailable: true,
//   phoneNumber: '3333333',
//   phoneType: 'HOME',
//   sourceDate: '2019-04-21T20:09:50Z',
//   updatedAt: '2019-04-21T20:09:50Z',
// },
// email: {
//   id: 100,
//   emailAddress: 'mike.wazowski@gmail.com',
// },
// mailingAddress: {
//   addressLine1: '1200 Park Ave',
//   addressLine2: 'string',
//   addressLine3: 'string',
//   addressPou: 'CORRESPONDENCE',
//   addressType: 'domestic',
//   city: 'Emeryville',
//   countryName: 'United States',
//   countryCodeFips: 'US',
//   countryCodeIso2: 'US',
//   countryCodeIso3: 'USA',
//   createdAt: '2019-04-21T20:09:50Z',
//   effectiveEndDate: '2019-04-21T20:09:50Z',
//   effectiveStartDate: '2019-04-21T20:09:50Z',
//   id: 123,
//   internationalPostalCode: '94608',
//   province: 'string',
//   sourceDate: '2019-04-21T20:09:50Z',
//   stateCode: 'NY',
//   updatedAt: '2019-04-21T20:09:50Z',
//   zipCode: '94608',
//   zipCodeSuffix: '1234',
// }
