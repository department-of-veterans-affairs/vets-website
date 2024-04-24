import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { getStatementPageTitle } from '../helpers';

/** @type {PageSchema} */
export const statementPage = {
  uiSchema: {
    ...titleUI(({ formData }) => getStatementPageTitle(formData)),
    statement: {
      'ui:widget': 'textarea',
      'ui:autocomplete': 'off',
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['statement'],
    properties: {
      statement: {
        type: 'string',
      },
    },
  },
};
