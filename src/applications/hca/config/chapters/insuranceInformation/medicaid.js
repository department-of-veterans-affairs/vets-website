// @ts-check
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedicaidDescription } from '../../../components/FormDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { isMedicaidEligible } = FULL_SCHEMA.properties;

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
      isMedicaidEligible,
    },
  },
};
