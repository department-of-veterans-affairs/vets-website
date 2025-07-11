import {
  dateOfBirthUI,
  dateOfDeathUI,
  dateOfBirthSchema,
  dateOfDeathSchema,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import environment from 'platform/utilities/environment';

import { dateOfDeathValidation } from '../helpers';

/** @type {PageSchema} */
const dateOfBirthUISchema = environment.isProduction()
  ? dateOfBirthUI()
  : {
      ...dateOfBirthUI(),
      'ui:options': {
        ...dateOfBirthUI()['ui:options'],
        customYearErrorMessage: `Please enter a year between 1900 and ${new Date().getFullYear()}`,
      },
    };

const dateOfDeathUISchema = environment.isProduction()
  ? dateOfDeathUI()
  : {
      ...dateOfDeathUI(),
      'ui:options': {
        ...dateOfDeathUI()['ui:options'],
        customYearErrorMessage: `Please enter a year between 1900 and ${new Date().getFullYear()}`,
      },
    };
export default {
  uiSchema: {
    ...titleUI(
      'Veteran or Reservist’s details',
      'Tell us who you’re requesting a Presidential Memorial Certificate for.',
    ),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUISchema,
    veteranDateOfDeath: dateOfDeathUISchema,
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
