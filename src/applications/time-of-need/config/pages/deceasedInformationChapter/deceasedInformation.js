// import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const deceasedInformation = {
  uiSchema: {
    'ui:title': 'Deceased Veteran details',
    firstName: textUI({ title: 'First name' }),
    middleName: textUI({ title: 'Middle name' }),
    lastName: textUI({ title: 'Last name' }),
    suffix: {
      'ui:title': 'Suffix',
      'ui:widget': 'select',
      'ui:options': {
        classNames: 'vads-u-margin-top--2', // add vertical spacing on mobile
      },
    },
    maidenName: textUI({ title: 'Maiden name' }),
  },
  schema: {
    type: 'object',
    properties: {
      firstName: { ...textSchema, maxLength: 30 },
      middleName: { ...textSchema, maxLength: 30 },
      lastName: { ...textSchema, maxLength: 30 },
      suffix: {
        type: 'string',
        enum: ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
        enumNames: ['Select (optional)', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
      },
      maidenName: { ...textSchema, maxLength: 30 },
    },
    required: ['firstName', 'lastName'],
  },
};

export default deceasedInformation;
