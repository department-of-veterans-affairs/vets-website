import React from 'react';

import GroupCheckboxWidget from '../components/GroupCheckboxWidget';

const validation = {
  pattern: (errors, values) => {
    if (!Object.keys(values).some(key => values[key])) {
      errors.addError('Check at least one!');
    }
  },
  widget: (errors, value) => {
    if ((value || '').trim() === '') {
      errors.addError('Check at least one!');
    }
  },
}

const groupCheckbox = {
  title: 'Section Title: Checkbox group validation',
  path: 'checkbox-group-validation',
  uiSchema: {
    'ui:title': 'Page Title: Group checkbox validation',
    'ui:description': 'Page Description: Group checkbox validation issue & workaround',
    checkboxGroupObjectPattern: {
      'ui:title': 'Group title: Which books have you read?',
      'ui:description': 'Group description: You may check more than one (Hide second using CSS).',
      'ui:required': () => true,
      'ui:validations': [validation.pattern],
      'ui:errorMessages': {
        required: 'Check at least one',
      },
      'ui:options': {
        showFieldLabel: true,
        forceDivWrapper: true,
      },
      hasReadPrideAndPrejudice: {
        'ui:title': 'Pride and Prejudice by Jane Austen',
      },
      hasReadJaneEyre: {
        'ui:title': 'Jane Eyre by Charlotte Brontë',
      },
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
      checkboxGroupObjectPattern: {
        type: 'object',
        properties: {
          hasReadPrideAndPrejudice: { type: 'boolean' },
          hasReadJaneEyre: { type: 'boolean' },
          hasReadGreatGatsby: { type: 'boolean' },
          hasReadBuddenbrooks: { type: 'boolean' },
        },
      },
    },
  },
};

export default groupCheckbox;
