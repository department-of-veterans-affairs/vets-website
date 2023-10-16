import React from 'react';

import {
  dateOfBirthUI,
  dateOfDeathUI,
  dateOfBirthSchema,
  dateOfDeathSchema,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { dateOfDeathValidation } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-margin-y--0">
        Tell us who you’re requesting a Presidential Memorial Certificate for
      </h3>
    ),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
    veteranDateOfDeath: dateOfDeathUI(),
    // can't move this validation to Forms-Library web-component-patterns
    // since one pattern can't detect presence of the other
    'ui:validations': [dateOfDeathValidation],
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      veteranDateOfDeath: dateOfDeathSchema,
    },
    required: ['veteranFullName', 'veteranDateOfBirth', 'veteranDateOfDeath'],
  },
};
