import React from 'react';

const yourName = (
  <h3 className="vads-u-margin-top--neg2p5 full-name">Your name</h3>
);
export const uiSchema = {
  veteranFullName: {
    'ui:title': yourName,
    first: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    middle: {
      'ui:title': 'Middle initial',
      'ui:options': {
        maxLength: 1,
        widgetClassNames: 'input-small',
      },
    },
    last: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    suffix: {
      'ui:options': {
        classNames: 'hidden',
      },
    },
  },
};
export const schema = {
  type: 'object',
  required: ['veteranFullName'],
  properties: {
    veteranFullName: {
      type: 'object',
      required: ['first', 'last'],
      properties: {
        first: { type: 'string' },
        middle: { type: 'string' },
        last: { type: 'string' },
        suffix: { type: 'string' },
      },
    },
  },
};
