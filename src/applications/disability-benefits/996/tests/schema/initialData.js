// Test data for HLR
// import { addXMonths } from '../../helpers';

export default {
  veteran: {
    phoneNumber: '5033333333',
    emailAddress: 'mike.wazowski@gmail.com',
    ssnLastFour: '9876',
    vaFileNumber: '8765',
    addressLine1: '1200 Park Ave',
    addressLine2: '',
    addressLine3: '',
    city: 'Emeryville',
    countryCode: 'USA',
    stateOrProvinceCode: 'CA',
    zipPostalCode: '94608',
  },

  // Leave 'view:selected' set to false for unit testing
  contestedIssues: [
    {
      type: 'ContestableIssue',
      attributes: {
        item: 'Tinnitus',
        description: `Rinnging in the ears. More intese in right ear. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit.`,
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        ratingPercentage: 10,
        'view:selected': false,
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        item: 'Headaches',
        description: 'Acute chronic head pain',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        ratingPercentage: 50,
        'view:selected': false,
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'tinnitus',
        decisionDate: '1900-01-01',
        decisionIssueId: 1,
        ratingIssueId: '2',
        ratingDecisionIssueId: '',
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'left knee',
        decisionDate: '1900-01-02',
        decisionIssueId: 4,
        ratingIssueId: '',
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'right knee',
        decisionDate: '1900-01-03',
        ratingIssueId: '6',
        ratingDecisionIssueId: '',
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'PTSD',
        decisionDate: '1900-01-04',
        decisionIssueId: 8,
        ratingDecisionIssueId: '',
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'Traumatic Brain Injury',
        decisionDate: '1900-01-05',
        decisionIssueId: 10,
      },
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'right shoulder',
        decisionDate: '1900-01-0',
      },
    },
  ],

  sameOffice: false,
  informalConference: null,
  informalConferenceRep: {
    name: 'Fred Flintstone',
    phone: '8005551212',
  },
  informalConferenceTimes: [],
};
