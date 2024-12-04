import React from 'react';
import {
  emailSchema,
  emailUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import UnsavedFieldNote from '../components/UnsavedFieldNote';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': <UnsavedFieldNote fieldName="email address" />,
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      emailAddress: emailSchema,
    },
    required: ['emailAddress'],
  },
};
