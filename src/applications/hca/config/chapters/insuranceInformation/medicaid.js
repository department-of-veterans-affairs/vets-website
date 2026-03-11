// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedicaidDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['insurance-info--medicaid-title'], MedicaidDescription),
    isMedicaidEligible: yesNoUI({
      title: content['insurance-info--medicaid-label'],
    }),
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible'],
    properties: {
      isMedicaidEligible: yesNoSchema,
    },
  },
};
