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
      applicatntType: {
        type: 'string',
        enum: [
          'veteran',
          'spouse',
          'caregiverEnrolled',
          'caregiverOfVeteran',
          'CHAMPVA',
        ],
      },
    },
  },
};

export const uiSchema = {
  attestation: {
    applicatntType: {
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
        },
      },
    },
  },
};
