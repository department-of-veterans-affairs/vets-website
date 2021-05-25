import React from 'react';
import DynamicRadioWidget from './DynamicRadioWidget.jsx';
import { vaLocation } from '../schema-imports';

function ReviewWidget({ value }) {
  return <span>{value ? value?.split('|')[0] : `None`}</span>;
}

export const schema = {
  vaLocation,
};

export const uiSchema = {
  vaLocation: {
    preferredFacility: {
      'ui:title': 'Selected VA medical center',
      'ui:widget': DynamicRadioWidget,
      'ui:options': {
        hideLabelText: true,
      },
      'ui:reviewWidget': ReviewWidget,
      'ui:required': () => true,
    },
  },
};
