import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { getStatementPageTitle } from '../helpers';

/** @type {PageSchema} */
export const veteranStatementPage = {
  uiSchema: {
    ...titleUI(({ formData }) => getStatementPageTitle(formData)),
    veteranStatement: {
      'ui:widget': 'textarea',
      'ui:autocomplete': 'off',
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranStatement'],
    properties: {
      statement: {
        type: 'string',
      },
    },
  },
};

/** @type {PageSchema} */
export const nonVeteranStatementPage = {
  uiSchema: {
    ...titleUI(({ formData }) => getStatementPageTitle(formData)),
    nonVeteranStatement: {
      'ui:widget': 'textarea',
      'ui:autocomplete': 'off',
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['nonVeteranStatement'],
    properties: {
      statement: {
        type: 'string',
      },
    },
  },
};
