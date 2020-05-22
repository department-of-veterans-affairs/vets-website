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
        issue: 'Tinnitus',
        subjectText: `Rinnging in the ears. More intese in right ear. This is
          more text so the description goes into the second line.`,
        percentNumber: 10,
        decisionDate: '2011-01-01',
        decisionIssueId: 42,
        ratingIssueId: '52',
        ratingDecisionIssueId: '',
      },
      'view:selected': false,
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'Headaches',
        subjectText: 'Acute chronic head pain',
        percentNumber: 50,
        decisionDate: '2011-01-02',
        decisionIssueId: 44,
        ratingIssueId: '66',
        ratingDecisionIssueId: '',
      },
      'view:selected': false,
    },
    {
      type: 'ContestableIssue',
      attributes: {
        issue: 'Back sprain',
        percentNumber: 5,
        decisionDate: '2010-01-01',
        decisionIssueId: 1,
        ratingIssueId: '2',
        ratingDecisionIssueId: '',
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
