import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { allowanceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Type of burial allowance'),
    burialAllowanceRequested: checkboxGroupUI({
      title: 'What type of burial allowance are you claiming?',
      hint: 'Check any that apply to you',
      required: true,
      labels: allowanceLabels,
    }),
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
