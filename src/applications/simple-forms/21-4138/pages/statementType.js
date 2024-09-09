import {
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  ESCAPE_HATCH,
  STATEMENT_TYPES,
  STATEMENT_TYPE_LABELS,
} from '../config/constants';

/** @type {PageSchema} */
export const statementTypePage = {
  uiSchema: {
    statementType: {
      ...radioUI({
        title: 'What kind of statement do you want to submit?',
        hint:
          'We want to make sure this is the right form for you. Before you continue with VA Form 21-4138, select one statement that best describes the action you want to take.',
        labels: STATEMENT_TYPE_LABELS,
        tile: true,
        errorMessages: {
          required: "Select the kind of statement you'd like to submit",
        },
        labelHeaderLevel: '1',
      }),
    },
    'view:additionalInfoStatementType': {
      'ui:description': ESCAPE_HATCH,
    },
  },
  schema: {
    type: 'object',
    properties: {
      statementType: radioSchema(Object.values(STATEMENT_TYPES)),
      'view:additionalInfoStatementType': {
        type: 'object',
        properties: {},
      },
    },
    required: ['statementType'],
  },
};
