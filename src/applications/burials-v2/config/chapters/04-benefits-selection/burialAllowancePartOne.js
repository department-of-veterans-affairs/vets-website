import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { allowanceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial allowance'),
    burialAllowanceRequested: {
      ...checkboxGroupUI({
        title: 'What type of burial allowance are you claiming?',
        required: true,
        labels: allowanceLabels,
      }),
      'ui:options': {
        classNames: 'vads-u-margin-top--0 vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['burialAllowanceRequested'],
    properties: {
      burialAllowanceRequested: {
        ...checkboxGroupSchema(['service', 'nonService', 'unclaimed']),
      },
    },
  },
};
