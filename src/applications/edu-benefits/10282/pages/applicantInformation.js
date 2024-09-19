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
    last: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    middle: {
      'ui:title': 'Middle initial',
      'ui:options': {
        maxLength: 1,
        widgetClassNames: 'input-small',
      },
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        classNames: 'hidden',
      },
    },
  },
};
