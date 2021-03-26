import DynamicCheckboxWidget from './DynamicCheckboxWidget';
import React from 'react';

function ReviewWidget({ value }) {
  // console.log(value);

  return <span>{value}</span>;
}

export const schema = {
  vaLocation: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
      },
    },
  },
};

export const uiSchema = {
  vaLocation: {
    location: {
      'ui:widget': DynamicCheckboxWidget,
      'ui:reviewWidget': ReviewWidget,
      'ui:options': {
        hideLabelText: true,
      },
    },
  },
};
