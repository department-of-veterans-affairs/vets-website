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
};

const groupCheckbox = {
  title: 'Section Title: Checkbox group validation',
  path: 'checkbox-group-validation',
  uiSchema: {
    'ui:title': 'Page Title: Group checkbox validation',
    'ui:description':
      'Page Description: Group checkbox validation issue & workaround',
    topSeparator: {
      'ui:title': ' ',
      'ui:description': (
        <>
          <hr />
          <strong>Checkbox group pattern</strong>
          <p>'ui:description' is duplicated. hide the second one using CSS</p>
        </>
      ),
    },
    checkboxGroupObjectPattern: {
      'ui:title': 'Group title: Which books have you read?',
      'ui:description':
        'Group description: You may check more than one (Hide second using CSS).',
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
    hoizontalRule: {
      'ui:title': ' ',
      'ui:description': (
        <>
          <hr />
          <strong>va-checkbox-group widget</strong>
        </>
      ),
    },
    checkboxGroupWidget: {
      'ui:title': 'Group title: Which books have you read?',
      'ui:description':
        'Group description: You may check more than one (Hide second using CSS).',
      'ui:widget': GroupCheckboxWidget,
      'ui:required': () => true,
      'ui:validations': [validation.widget],
      'ui:errorMessages': {
        required: 'Check at least one',
      },
      'ui:options': {
        showFieldLabel: true,
        forceDivWrapper: true,
        labels: [
          'Pride and Prejudice by Jane Austen',
          'Jane Eyre by Charlotte Brontë',
          'The Great Gatsby by F. Scott Fitzgerald',
          'Buddenbrooks by Thomas Mann',
        ],
      },
    },
    hoizontalRule2: {
      'ui:title': ' ',
      'ui:description': <hr />,
    },
  },
  schema: {
    type: 'object',
    properties: {
      topSeparator: {
        type: 'object',
        properties: {},
      },
      checkboxGroupObjectPattern: {
        type: 'object',
        properties: {
          hasReadPrideAndPrejudice: { type: 'boolean' },
          hasReadJaneEyre: { type: 'boolean' },
          hasReadGreatGatsby: { type: 'boolean' },
          hasReadBuddenbrooks: { type: 'boolean' },
        },
      },
      hoizontalRule: {
        type: 'object',
        properties: {},
      },
      checkboxGroupWidget: {
        type: 'string',
      },
      hoizontalRule2: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default groupCheckbox;
