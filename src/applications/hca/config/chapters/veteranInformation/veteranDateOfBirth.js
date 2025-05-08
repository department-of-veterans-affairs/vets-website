import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import { FULL_SCHEMA } from '../../../utils/imports';

const { date } = FULL_SCHEMA.definitions;

export default {
  uiSchema: {
    veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth'],
    properties: {
      veteranDateOfBirth: date,
    },
  },
};
