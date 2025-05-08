import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Additional Marriages'),
    'ui:options': {
      viewField: () => null,
    },
    hasMorePreviousMarriages: {
      'ui:title': 'Do you have any other marriages to add?',
      'ui:widget': 'yesNo',
      'ui:options': {
        viewField: ({ formData }) =>
          formData ? <span>Yes</span> : <span>No</span>,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['hasMorePreviousMarriages'],
    properties: {
      hasMorePreviousMarriages: { type: 'boolean' },
    },
  },
};
