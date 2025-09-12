// import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const deceasedInformation = {
  uiSchema: {
    'ui:title': 'Deceased Veteran details',
    deceasedFirstName: textUI({ title: 'First name' }),
    deceasedMiddleName: textUI({ title: 'Middle name' }),
    deceasedLastName: textUI({ title: 'Last name' }),
    deceasedSuffix: {
      'ui:title': 'Suffix',
      'ui:widget': 'select',
      'ui:options': {
        classNames: 'vads-u-margin-top--2', // add vertical spacing on mobile
      },
    },
    deceasedMaidenName: textUI({ title: 'Maiden name' }),
  },
  schema: {
    type: 'object',
    properties: {
      deceasedFirstName: { ...textSchema, maxLength: 30 },
      deceasedMiddleName: { ...textSchema, maxLength: 30 },
      deceasedLastName: { ...textSchema, maxLength: 30 },
      deceasedSuffix: {
        type: 'string',
        enum: ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
        enumNames: ['Select (optional)', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
      },
      deceasedMaidenName: { ...textSchema, maxLength: 30 },
    },
    required: ['deceasedFirstName', 'deceasedLastName'],
  },
};

export default deceasedInformation;
