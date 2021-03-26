import {
  veteranLabel,
  spouseLabel,
  caregiverEnrolledLabel,
  caregiverOfVeteranLabel,
  champvaLabel,
} from './helpers';

export const schema = {
  attestation: {
    type: 'object',
    properties: {
      applicantType: {
        type: 'string',
        enum: [
          'veteran',
          'spouse',
          'caregiverEnrolled',
          'caregiverOfVeteran',
          'CHAMPVA',
          'none',
        ],
      },
    },
  },
};

export const uiSchema = {
  attestation: {
    applicantType: {
      'ui:title':
        'We have a limited amount of COVID-19 vaccines. We want to make sure we can offer vaccines to as many Veterans, family members, and caregivers as we can. We can only offer vaccines to people who are eligible under the law. Thank you for helping us to achieve our mission.',
      'ui:description': 'Which of these best describes you?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          veteran: veteranLabel,
          spouse: spouseLabel,
          caregiverEnrolled: caregiverEnrolledLabel,
          caregiverOfVeteran: caregiverOfVeteranLabel,
          CHAMPVA: champvaLabel,
          none: 'None of the above',
        },
      },
    },
  },
};
