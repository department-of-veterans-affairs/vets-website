// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['insurance-info--medicare-enrollment-title'],
      content['insurance-info--medicare-enrollment-description'],
    ),
    isEnrolledMedicarePartA: yesNoUI({
      title: content['insurance-info--medicare-enrollment-label'],
    }),
  },
  schema: {
    type: 'object',
    required: ['isEnrolledMedicarePartA'],
    properties: {
      isEnrolledMedicarePartA: yesNoSchema,
    },
  },
};
