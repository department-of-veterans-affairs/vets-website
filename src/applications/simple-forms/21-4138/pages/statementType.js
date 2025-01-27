import {
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  ESCAPE_HATCH,
  STATEMENT_TYPES,
  STATEMENT_TYPE_LABELS,
  STATEMENT_TYPE_DESCRIPTIONS,
} from '../config/constants';

/** @type {PageSchema} */
export const statementTypePage = {
  uiSchema: {
    statementType: {
      ...radioUI({
        title: 'What would you like to do?',
        description:
          "We’ve improved how we process certain types of statements and requests. Before you continue with VA Form 21-4138, tell us what you’re trying to do and we'll check if there's a quicker way to help you.",
        label: 'Select the option that describes what you want to do',
        labels: STATEMENT_TYPE_LABELS,
        descriptions: STATEMENT_TYPE_DESCRIPTIONS,
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
