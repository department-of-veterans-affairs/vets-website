import React from 'react';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

const containerTypeOptions = [
  { value: 'biodegradable', label: 'Biodegradable container' },
  { value: 'crematedNone', label: 'Cremated/No container' },
];

export default {
  uiSchema: {
    'ui:description': (
      <h3 className="vads-u-margin-top--0">Interment details</h3>
    ),
    containerType: {
      ...radioUI({
        title: 'What is the container type?',
        options: containerTypeOptions,
        required: true,
        errorMessages: { required: 'Select a container type' },
      }),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['containerType'],
    properties: {
      containerType: {
        type: 'string',
        enum: containerTypeOptions.map(o => o.value),
        enumNames: containerTypeOptions.map(o => o.label),
      },
    },
  },
};
