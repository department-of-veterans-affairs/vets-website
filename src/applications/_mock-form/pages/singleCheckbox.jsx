import React from 'react';

const checkboxValidation = (errors, value) => {
  if (!value) {
    errors.addError('Check me please!');
  }
};

const singleCheckbox = {
  title: 'Section Title: single checkbox validation',
  path: 'single-checkbox-validation',
  uiSchema: {
    'ui:title': 'Page Title: Single checkbox validation',
    'ui:description': 'Page Description: Single checkbox issues',
    'ui:options': {
      // page title wrapped in a <label> breaking a11y, so use forceDivWrapper
      forceDivWrapper: true,
    },
    // Without 'ui:widget' set, the `ui:description` and validation error
    // messages are not visible
    // 'ui:widget': 'checkbox', // ************************************
    exampleSeparator: {
      'ui:title': ' ',
      'ui:description': (
        <>
          <hr />
          <strong>Optional example</strong>
          <p>
            'ui:description' ignored when 'ui:widget': 'checkbox' is NOT set
          </p>
        </>
      ),
    },
    optionalCheckbox: {
      'ui:title': 'Checkbox Title: Optional checkbox',
      // this description never shows up
      'ui:description': 'Checkbox Description: Blerg',
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>Optional checkbox</dt>
          <dd>{children}</dd>
        </div>
      ),
    },
    hoizontalRule: {
      'ui:title': ' ',
      'ui:description': (
        <>
          <hr />
          <strong>Required example</strong>
          <p>'ui:title' duplicated when 'ui:widget': 'checkbox' is set</p>
        </>
      ),
    },
    requiredCheckbox: {
      // Set 'ui:title' as a single space blank, the (*Required) label needs to be
      // hidden using CSS
      'ui:title':
        'Checkbox Title: Required checkbox (Need CSS to HIDE the first title)',
      'ui:description': 'Checkbox Description: Using checkbox widget',
      'ui:options': {
        forceDivWrapper: true,
        showFieldLabel: false,
      },
      // If `ui:widget` isn't set, validation error messages will not show
      'ui:widget': 'checkbox', // ************************************
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>Required checkbox</dt>
          <dd>{children}</dd>
        </div>
      ),
      'ui:required': () => true,
      'ui:validations': [checkboxValidation],
      'ui:errorMessages': {
        enum: 'Checkbox enum error',
        required: 'Checkbox required error',
      },
    },
    hoizontalRule2: {
      'ui:title': ' ',
      'ui:description': <hr />,
    },
  },
  schema: {
    type: 'object',
    required: ['requiredCheckbox'],
    properties: {
      exampleSeparator: {
        type: 'object',
        properties: {},
      },
      optionalCheckbox: {
        type: 'boolean',
      },
      hoizontalRule: {
        type: 'object',
        properties: {},
      },
      requiredCheckbox: {
        type: 'boolean',
        emum: true,
        enumNames: ['Yes'],
      },
      hoizontalRule2: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default singleCheckbox;
