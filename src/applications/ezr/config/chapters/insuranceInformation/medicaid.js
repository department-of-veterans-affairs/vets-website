import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicaidDescription from '../../../components/FormDescriptions/MedicaidDescription';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:medicaidDescription': descriptionUI(MedicaidDescription, {
      hideOnReview: true,
    }),
    isMedicaidEligible: yesNoUI(content['insurance-medicaid-title']),
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible'],
    properties: {
      'view:medicaidDescription': VIEW_FIELD_SCHEMA,
      isMedicaidEligible: yesNoSchema,
    },
  },
};
