import PrefillMessage from '@department-of-veterans-affairs/platform-forms/save-in-progress/PrefillMessage';
import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import MedicaidDescription from '../../../components/FormDescriptions/MedicaidDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:isMedicaidEligible': {
      'ui:title': MedicaidDescription,
      isMedicaidEligible: yesNoUI(content['insurance-medicaid-title']),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:isMedicaidEligible': {
        type: 'object',
        required: ['isMedicaidEligible'],
        properties: {
          isMedicaidEligible: yesNoSchema,
        },
      },
    },
  },
};
