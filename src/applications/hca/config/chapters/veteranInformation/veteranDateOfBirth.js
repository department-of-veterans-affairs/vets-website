import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { date } = FULL_SCHEMA.definitions;

export default {
  uiSchema: {
    ...titleUI(content['vet-info--date-of-birth-title']),
    veteranDateOfBirth: currentOrPastDateUI(
      content['vet-info--date-of-birth-label'],
    ),
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth'],
    properties: {
      veteranDateOfBirth: date,
    },
  },
};
