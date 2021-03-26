import React from 'react';
import DynamicCheckboxWidget from './DynamicCheckboxWidget.jsx';

function ReviewWidget({ value }) {
  return <span>{value}</span>;
}

export const schema = {
  vaLocation: {
    type: 'object',
    properties: {
      preferredFacility: {
        type: 'string',
      },
    },
  },
};

export const uiSchema = {
  vaLocation: {
    preferredFacility: {
      'ui:widget': DynamicCheckboxWidget,
      'ui:options': {
        hideLabelText: true,
      },
      'ui:reviewWidget': ReviewWidget,
    },
  },
};
