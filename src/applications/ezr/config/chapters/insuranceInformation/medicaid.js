import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  yesNoUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicaidDescription from '../../../components/FormDescriptions/MedicaidDescription';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const { isMedicaidEligible } = ezrSchema.properties;

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
      isMedicaidEligible,
    },
  },
};
