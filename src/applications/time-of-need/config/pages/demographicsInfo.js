import React from 'react';
import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Demographics'),
    'ui:description': (
      <div>
        <p>
          We require demographic information as part of this application. We use
          this information for statistical purposes only.
        </p>
      </div>
    ),
    maritalStatus: radioUI({
      title: "What's the deceased’s marital status?",
      options: [
        { value: 'single', label: 'Single' },
        { value: 'separated', label: 'Separated' },
        { value: 'married', label: 'Married' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'widowed', label: 'Widowed' },
        { value: 'preferNoAnswer', label: 'Prefer not to answer' },
      ],
    }),
    gender: radioUI({
      title: "What's the deceased’s gender",
      options: [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'preferNoAnswer', label: 'Prefer not to answer' },
      ],
    }),
  },
  schema: {
    type: 'object',
    required: ['maritalStatus', 'gender'],
    properties: {
      maritalStatus: {
        type: 'string',
        enum: [
          'single',
          'separated',
          'married',
          'divorced',
          'widowed',
          'preferNoAnswer',
        ],
        enumNames: [
          'Single',
          'Separated',
          'Married',
          'Divorced',
          'Widowed',
          'Prefer not to answer',
        ],
      },
      gender: {
        type: 'string',
        enum: ['female', 'male', 'preferNoAnswer'],
        enumNames: ['Female', 'Male', 'Prefer not to answer'],
      },
    },
  },
};
