import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { isEnrolledMedicarePartA } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['insurance-info--medicare-enrollment-title'],
      content['insurance-info--medicare-enrollment-description'],
    ),
    isEnrolledMedicarePartA: {
      'ui:title': content['insurance-info--medicare-enrollment-label'],
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isEnrolledMedicarePartA'],
    properties: {
      isEnrolledMedicarePartA,
    },
  },
};
