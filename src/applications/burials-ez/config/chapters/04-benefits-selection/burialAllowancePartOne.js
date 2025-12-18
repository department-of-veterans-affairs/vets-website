import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { allowanceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Type of burial allowance'),
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
