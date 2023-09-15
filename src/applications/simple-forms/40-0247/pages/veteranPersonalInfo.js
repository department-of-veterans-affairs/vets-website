import React from 'react';

import {
  dateOfBirthSchema,
  dateOfDeathSchema,
  currentOrPastDateUI,
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
    veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
    veteranDateOfDeath: currentOrPastDateUI('Date of death'),
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
