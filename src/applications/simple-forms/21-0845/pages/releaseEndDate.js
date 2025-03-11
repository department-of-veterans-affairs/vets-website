import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { releaseEndDateValidation } from '../validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Date to stop releasing your information'),
    releaseEndDate: {
      ...currentOrPastDateUI({
        title: 'When should we stop releasing your information?',
        description: 'Enter a valid date',
        errorMessages: {
          required: 'Please provide an end date.',
          pattern: 'Please provide a valid end date.',
        },
      }),
      'ui:validations': [releaseEndDateValidation],
    },
  },
  schema: {
    type: 'object',
    required: ['releaseEndDate'],
    properties: {
      releaseEndDate: currentOrPastDateSchema,
    },
  },
};
