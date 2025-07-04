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
export default {
  uiSchema: {
    ...(environment.isProduction()
      ? titleUI(
          'Tell us who you’re requesting a Presidential Memorial Certificate for',
        )
      : titleUI(
          'Veteran or Reservist’s details',
          'Tell us who you’re requesting a Presidential Memorial Certificate for.',
        )),
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
