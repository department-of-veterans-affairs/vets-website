import React from 'react';

import moment from 'moment';

import {
  dateOfBirthUI,
  dateOfDeathUI,
  dateOfBirthSchema,
  dateOfDeathSchema,
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
    veteranDateOfBirth: dateOfBirthUI(),
    veteranDateOfDeath: dateOfDeathUI(),
    // can't move this validation to Forms-Library web-component-patterns
    // since one pattern can't detect presence of the other
    'ui:validations': [
      // date of death should be after date of birth
      (errors, fields) => {
        const { veteranDateOfBirth, veteranDateOfDeath } = fields;
        const dob = moment(veteranDateOfBirth);
        const dod = moment(veteranDateOfDeath);

        if (dod.isBefore(dob)) {
          errors.veteranDateOfDeath.addError(
            'Provide a date that is after the date of birth',
          );
        }
      },
    ],
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
