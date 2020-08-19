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
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Tinnitus',
        description: `Rinnging in the ears. More intese in right ear. This is
          more text so the description goes into the second line.`,
        ratingIssuePercentNumber: 10,
        approxDecisionDate: '2011-01-01',
        decisionIssueId: 42,
        ratingIssueReferenceId: '52',
        ratingDecisionReferenceId: '',
      },
      'view:selected': false,
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Headaches',
        description: 'Acute chronic head pain',
        ratingIssuePercentNumber: 50,
        approxDecisionDate: '2011-01-02',
        decisionIssueId: 44,
        ratingIssueReferenceId: '66',
        ratingDecisionReferenceId: '',
      },
      'view:selected': false,
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Back sprain',
        ratingIssuePercentNumber: 5,
        approxDecisionDate: '2010-01-01',
        decisionIssueId: 1,
        ratingIssueReferenceId: '2',
        ratingDecisionReferenceId: '',
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
