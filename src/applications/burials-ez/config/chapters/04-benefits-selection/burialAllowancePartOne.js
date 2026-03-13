import {
  checkboxGroupUI,
  checkboxGroupSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { allowanceLabels } from '../../../utils/labels';

export default {
  uiSchema: {
    ...titleUI('Type of burial allowance'),
    burialAllowanceRequested: {
      ...checkboxGroupUI({
        title:
          'Which burial allowances are you applying for? Select all that apply.',
        required: true,
        labels: allowanceLabels,
      }),
      'ui:options': {
        tile: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['burialAllowanceRequested'],
    properties: {
      burialAllowanceRequested: checkboxGroupSchema(
        Object.keys(allowanceLabels),
      ),
    },
  },
};
