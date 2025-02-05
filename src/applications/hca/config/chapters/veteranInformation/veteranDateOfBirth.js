import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
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
