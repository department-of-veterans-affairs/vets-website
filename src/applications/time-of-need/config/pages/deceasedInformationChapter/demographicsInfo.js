import React from 'react';
import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Deceased Veteran demographics'),
    'ui:description': (
      <div>
        <p>
          We require demographic information as part of this application. We use
          this information for statistical purposes only.
        </p>
      </div>
    ),
    maritalStatus: {
      ...radioUI({
        title: 'What’s the Veteran’s marital status?',
        options: [
          { value: 'married', label: 'Married' },
          { value: 'divorcedAnnulled', label: 'Divorced or annulled' },
          { value: 'separated', label: 'Separated' },
          { value: 'widowed', label: 'Widowed' },
          { value: 'neverMarried', label: 'Never married' },
        ],
      }),
      'ui:description':
        'If the Veteran is in a civil union or common law marriage that’s recognized by the state the union took place, select Married.',
      'ui:options': {
        useV3: true,
      },
    },
    gender: {
      ...radioUI({
        title: 'What’s the Veteran’s sex?',
        options: [
          { value: 'female', label: 'Female' },
          { value: 'male', label: 'Male' },
        ],
      }),
      'ui:options': {
        useV3: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus', 'gender'],
    properties: {
      maritalStatus: {
        type: 'string',
        enum: [
          'married',
          'divorcedAnnulled',
          'separated',
          'widowed',
          'neverMarried',
        ],
        enumNames: [
          'Married',
          'Divorced or annulled',
          'Separated',
          'Widowed',
          'Never married',
        ],
      },
      gender: {
        type: 'string',
        enum: ['female', 'male'],
        enumNames: ['Female', 'Male'],
      },
    },
  },
};
