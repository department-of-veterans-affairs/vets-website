import { attestation } from '../schema-imports';

import {
  title,
  eligibilityAccordion,
  veteranLabel,
  spouseLabel,
  caregiverEnrolledLabel,
  caregiverOfVeteranLabel,
  champvaLabel,
} from './helpers';

export const schema = {
  attestation,
};

export const uiSchema = {
  attestation: {
    introText: {
      'view:introText': {
        'ui:description': eligibilityAccordion,
      },
    },
    applicantType: {
      'ui:title': title,
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
