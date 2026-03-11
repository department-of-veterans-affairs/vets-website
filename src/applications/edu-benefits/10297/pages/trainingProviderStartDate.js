import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { currentOrPastDateSchema } from '~/platform/forms-system/src/js/web-component-patterns/datePatterns';

import { validateTrainingProviderStartDate } from '../helpers';
import DateField from '../components/DateField';

const uiSchema = {
  ...titleUI('Do you have a start date for the program you wish to enroll in?'),
  plannedStartDate: {
    'ui:webComponentField': DateField,
    'ui:title':
      "You can leave this blank if you haven't chosen a program yet. Enter a date on or after July 1, 2026.",
    'ui:errorMessages': { pattern: 'Please enter a valid date' },
    'ui:options': {
      customYearErrorMessage: 'Please enter a valid date',
      customMonthErrorMessage: 'Please enter a valid date',
      customDayErrorMessage: 'Please enter a valid date',
    },
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
