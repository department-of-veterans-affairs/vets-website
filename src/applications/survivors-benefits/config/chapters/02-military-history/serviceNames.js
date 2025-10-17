import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Service names',
  path: 'veteran/service-names',
  uiSchema: {
    ...titleUI('Service names'),
    'view:serviceNamesInfo': {
      'ui:description': () => (
        <p>
          In the next few questions, we'll ask you about other names you served
          under.
        </p>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:serviceNamesInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
