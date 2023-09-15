import React from 'react';

import {
  dateOfBirthSchema,
  dateOfDeathSchema,
  currentOrPastDateDigitsUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-margin-y--0">
        Tell us who you’re requesting a Presidential Memorial Certificate for
      </h3>
    ),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: currentOrPastDateDigitsUI('Date of birth'),
    veteranDateOfDeath: currentOrPastDateDigitsUI('Date of death'),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      veteranDateOfDeath: dateOfDeathSchema,
    },
    required: ['veteranFullName'],
  },
};
