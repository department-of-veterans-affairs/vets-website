import {
  checkboxUI,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-schemas';

/** @type {PageSchema} */
export default {
  uiSchema: {
    group: checkboxGroupUI({
      'ui:title': 'Group WC title: Which books have you read?',
      'ui:description': 'Group description: You may check more than one.',
      'ui:required': () => true,
      'ui:validations': [],
      'ui:errorMessages': {
        required: 'Check at least one',
      },
      'ui:options': {
        showFieldLabel: true,
        forceDivWrapper: true,
        properties: {
          hasReadPrideAndPrejudice: checkboxUI(),
          hasReadJaneEyre: checkboxUI(),
          hasReadGreatGatsby: checkboxUI(),
          hasReadBuddenbrooks: checkboxUI(),
        },
      },
      properties: {
        hasReadPrideAndPrejudice: checkboxUI(),
        hasReadJaneEyre: checkboxUI(),
        hasReadGreatGatsby: checkboxUI(),
        hasReadBuddenbrooks: checkboxUI(),
      },
    }),
    checkboxTile: {
      'ui:title': 'Group title: Which books have you read?',
      'ui:description':
        'Group description: You may check more than one (Hide second using CSS).',
      'ui:required': () => true,
      'ui:validations': [],
      'ui:errorMessages': {
        required: 'Check at least one',
      },
      'ui:options': {
        showFieldLabel: true,
        forceDivWrapper: true,
      },
      hasReadPrideAndPrejudice: checkboxUI(
        'Pride and Prejudice by Jane Austen',
      ),
      hasReadJaneEyre: checkboxUI('Jane Eyre by Charlotte Brontë'),
      hasReadGreatGatsby: {
        'ui:title': 'The Great Gatsby by F. Scott Fitzgerald',
      },
      hasReadBuddenbrooks: {
        'ui:title': 'Buddenbrooks by Thomas Mann',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      group: {
        type: 'object',
        properties: {
          hasReadPrideAndPrejudice: { type: 'boolean' },
          hasReadJaneEyre: { type: 'boolean' },
          hasReadGreatGatsby: { type: 'boolean' },
          hasReadBuddenbrooks: { type: 'boolean' },
        },
      },
      checkboxTile: {
        type: 'object',
        properties: {
          hasReadPrideAndPrejudice: { type: 'boolean' },
          hasReadJaneEyre: { type: 'boolean' },
          hasReadGreatGatsby: { type: 'boolean' },
          hasReadBuddenbrooks: { type: 'boolean' },
        },
      },
    },
    required: ['checkboxTile'],
  },
};
