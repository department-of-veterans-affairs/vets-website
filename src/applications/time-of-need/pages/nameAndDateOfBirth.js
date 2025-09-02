import React from 'react';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Deceased details'),
    'ui:description': (
      <div>
        <p>
          Provide details for the deceased. Later on, we’ll ask for your own
          details.
        </p>
      </div>
    ),
    fullName: {
      ...fullNameNoSuffixUI(),
      first: {
        ...fullNameNoSuffixUI().first,
        'ui:required': () => true,
      },
      last: {
        ...fullNameNoSuffixUI().last,
        'ui:required': () => true,
      },
      suffix: {
        'ui:widget': 'select',
        'ui:title': 'Suffix',
        'ui:options': {
          labels: {
            JR: 'Jr.',
            SR: 'Sr.',
            II: 'II',
            III: 'III',
            IV: 'IV',
          },
        },
      },
      maiden: textUI({ label: 'Maiden name' }),
    },
    ssn: textUI({ label: 'Social Security number' }),
    dateOfBirth: {
      ...dateOfBirthUI(),
      'ui:description':
        'Please enter two digits for the month and day and four digits for the year.',
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName: {
        ...fullNameNoSuffixSchema,
        properties: {
          ...fullNameNoSuffixSchema.properties,
          suffix: {
            type: 'string',
            enum: ['JR', 'SR', 'II', 'III', 'IV', ''],
            default: '',
          },
          maiden: { ...textSchema },
        },
      },
      ssn: { ...textSchema },
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
