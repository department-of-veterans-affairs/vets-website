import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from '~/platform/forms-system/src/js/web-component-patterns/datePatterns';

import { validateTrainingProviderStartDate } from '../helpers';

const uiSchema = {
  ...titleUI('Do you have a start date for the program you wish to enroll in?'),
  plannedStartDate: {
    ...currentOrPastDateUI({
      title: `You can leave this blank if you haven't chosen a program yet`,
      errorMessages: { pattern: 'Please enter a valid date' },
    }),
    'ui:validations': [validateTrainingProviderStartDate],
  },
};

const schema = {
  type: 'object',
  properties: {
    plannedStartDate: currentOrPastDateSchema,
  },
  required: [],
};

export { schema, uiSchema };
