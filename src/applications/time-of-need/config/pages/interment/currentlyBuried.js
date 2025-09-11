import React from 'react';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

const options = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'I don’t know' },
];

export default {
  uiSchema: {
    'ui:description': <AutoSaveNotice />,
    currentlyBuried: {
      ...radioUI({
        title:
          'Is there anyone currently buried in a VA national cemetery under the veteran’s eligibility?',
        options,
        required: true,
        errorMessages: { required: 'Please select an option' },
      }),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      currentlyBuried: {
        type: 'string',
        enum: ['yes', 'no', 'unknown'],
        enumNames: ['Yes', 'No', 'I don’t know'],
      },
    },
    required: ['currentlyBuried'],
  },
};
