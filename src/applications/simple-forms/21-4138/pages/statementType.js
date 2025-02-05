import {
  titleUI,
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  ESCAPE_HATCH,
  STATEMENT_TYPES,
  STATEMENT_TYPE_LABELS,
  STATEMENT_TYPE_DESCRIPTIONS,
  STATEMENT_TYPE_PAGE,
} from '../config/constants';

/** @type {PageSchema} */
export const statementTypePage = {
  uiSchema: {
    ...titleUI(STATEMENT_TYPE_PAGE.title, STATEMENT_TYPE_PAGE.description),
    statementType: {
      ...radioUI({
        title: 'Select the option that describes what you want to do',
        labels: STATEMENT_TYPE_LABELS,
        descriptions: STATEMENT_TYPE_DESCRIPTIONS,
        tile: true,
        errorMessages: {
          required: "Select the kind of statement you'd like to submit",
        },
      }),
    },
    'view:additionalInfoStatementType': { 'ui:description': ESCAPE_HATCH },
  },
  schema: {
    type: 'object',
    properties: {
      statementType: radioSchema(Object.values(STATEMENT_TYPES)),
      'view:additionalInfoStatementType': { type: 'object', properties: {} },
    },
    required: ['statementType'],
  },
};
