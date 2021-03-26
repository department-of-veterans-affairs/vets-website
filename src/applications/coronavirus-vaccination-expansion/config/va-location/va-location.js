import React from 'react';
import DynamicCheckboxWidget from './DynamicCheckboxWidget.jsx';
import { vaLocation } from '../schema-imports';

function ReviewWidget({ value }) {
  return <span>{value}</span>;
}

export const schema = {
  vaLocation,
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
