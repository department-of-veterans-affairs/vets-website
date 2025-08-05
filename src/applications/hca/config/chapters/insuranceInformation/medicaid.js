import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import { MedicaidDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const { isMedicaidEligible } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['insurance-info--medicaid-title'], MedicaidDescription),
    isMedicaidEligible: {
      'ui:title': content['insurance-info--medicaid-label'],
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible'],
    properties: {
      isMedicaidEligible,
    },
  },
};
