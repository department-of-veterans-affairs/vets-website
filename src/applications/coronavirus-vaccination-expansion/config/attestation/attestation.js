import { attestation } from '../schema-imports';

import {
  veteranLabel,
  spouseLabel,
  caregiverEnrolledLabel,
  caregiverOfVeteranLabel,
  champvaLabel,
  noneApplyText,
} from './helpers';

export const schema = {
  attestation,
};

export const uiSchema = {
  attestation: {
    introText: {
      'view:introText': {
        'ui:description':
          'We have a limited amount of COVID-19 vaccines. We want to make sure we can offer vaccines to as many Veterans, family members, and caregivers as we can. We can only offer vaccines to people who are eligible under the law. Thank you for helping us to achieve our mission.',
      },
    },
    notEligibleText: {
      'view:notEligibleText': {
        'ui:description': noneApplyText,
      },
    },
    applicantType: {
      'ui:title': 'Which of these best describes you?',
      // 'ui:description': 'Which of these best describes you?',
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
      'ui:required': () => true,
    },
  },
};
